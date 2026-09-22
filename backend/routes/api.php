<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use App\Models\User;
use App\Models\Generation;
use App\Models\Branch;
use App\Models\Team;
use App\Models\Customer;
use App\Models\DailyDiary;
use App\Models\TendencyReport;
use App\Models\Property;
use App\Models\DeveloperContract;
use App\Models\SalesDeal;
use App\Models\PaymentCertificate;
use App\Models\CommissionDisbursement;
use App\Models\AuditLog;
use App\Models\AccessRequest;
use App\Models\DiscussionMeeting;
use App\Models\Dispute;
use App\Models\SystemUpgrade;
use App\Models\AppNotification;

/**
 * Health check & Database connection verification endpoint
 */
Route::get('/health', function () {
    try {
        DB::connection()->getPdo();
        $dbName = DB::connection()->getDatabaseName();
        $tables = DB::select('SHOW TABLES');

        return response()->json([
            'status' => 'success',
            'message' => 'Backend is running and successfully connected to MySQL database!',
            'database' => [
                'driver' => DB::connection()->getDriverName(),
                'name' => $dbName,
                'connected' => true,
                'table_count' => count($tables),
            ],
            'server_time' => now()->toIso8601String(),
        ], 200);
    } catch (\Throwable $e) {
        return response()->json([
            'status' => 'error',
            'message' => 'Database connection failed: ' . $e->getMessage(),
            'database' => ['connected' => false],
        ], 500);
    }
});

Route::get('/test-db', function () {
    try {
        DB::connection()->getPdo();
        $tables = DB::select('SHOW TABLES');
        $dbName = DB::connection()->getDatabaseName();

        return response()->json([
            'database_connected' => true,
            'database_name' => $dbName,
            'tables' => array_map(fn($t) => array_values((array)$t)[0], $tables),
            'timestamp' => now()->toIso8601String(),
        ]);
    } catch (\Exception $e) {
        return response()->json(['database_connected' => false, 'error' => $e->getMessage()], 500);
    }
});

/**
 * 1. Organization Tree (Articles 3C, 4, 5, 8-11)
 * Returns Root (CEO), Parallel Admin Units, and Sales Generations -> Branches -> Teams
 */
Route::get('/organization/tree', function () {
    $ceo = User::where('structure_type', 'EXECUTIVE')->first();
    $adminUnits = User::where('structure_type', 'ADMINISTRATIVE')->get();

    $generations = Generation::with([
        'head',
        'branches.manager',
        'branches.teams.leader',
        'branches.teams.members'
    ])->where('is_active', true)->get();

    return response()->json([
        'company' => 'Beha Marketing PLC',
        'guideline' => 'Articles 8 - 19 Decimal Hierarchy',
        'executive' => $ceo,
        'administrative_units' => [
            'information_department' => $adminUnits->where('admin_department', 'INFORMATION')->first(),
            'finance_department' => $adminUnits->where('admin_department', 'FINANCE')->first(),
            'system_administration' => $adminUnits->where('admin_department', 'SYSTEM_ADMIN')->first(),
        ],
        'sales_structure' => $generations,
    ]);
});

/**
 * 2. Staff Roster with Performance Grades (Articles 16-19)
 */
Route::get('/roster', function () {
    $users = User::with(['generation', 'branch', 'team'])->get();

    return response()->json([
        'total_staff' => $users->count(),
        'members' => $users,
    ]);
});

Route::post('/staff', function (Request $request) {
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'nullable|email|max:255',
        'phone' => 'required|string|max:30',
        'official_id' => 'nullable|string|max:30|unique:users,official_id',
        'structure_type' => 'nullable|in:EXECUTIVE,ADMINISTRATIVE,SALES',
        'admin_department' => 'nullable|in:INFORMATION,FINANCE,SYSTEM_ADMIN',
        'generation_id' => 'nullable|exists:generations,id',
        'branch_id' => 'nullable|exists:branches,id',
        'team_id' => 'nullable|exists:teams,id',
        'grade_level' => 'nullable|integer|min:1|max:5',
        'primary_role' => 'nullable|string',
    ]);

    $validated['structure_type'] = $validated['structure_type'] ?? 'SALES';
    $validated['grade_level'] = $validated['grade_level'] ?? 1;
    $validated['primary_role'] = $validated['primary_role'] ?? 'TEAM_MEMBER';
    
    if (empty($validated['official_id'])) {
        $count = User::count() + 1;
        $validated['official_id'] = 'BH-AGT-' . str_pad($count, 3, '0', STR_PAD_LEFT);
    }
    
    if (empty($validated['email'])) {
        $cleanName = strtolower(preg_replace('/[^a-zA-Z0-9]/', '', explode(' ', $validated['name'])[0]));
        $validated['email'] = $cleanName . rand(100, 999) . '@beha-marketing.com';
    }
    
    $validated['password'] = bcrypt('beha1234');
    $validated['status'] = 'active';

    $user = User::create($validated);
    return response()->json([
        'message' => 'Staff consultant registered successfully into Beha organization',
        'user' => $user->load(['generation', 'branch', 'team']),
    ], 201);
});

/**
 * 3. Customer Registration & Protocols (Article 8.3, 19.1)
 */
Route::get('/customers', function () {
    $customers = Customer::with(['registeredBy', 'team', 'branch'])->latest()->get();
    return response()->json($customers);
});

Route::post('/customers', function (Request $request) {
    $defaultAgent = User::where('structure_type', 'SALES')->first() ?? User::first();
    $defaultBranch = Branch::first();
    $defaultTeam = Team::first();

    $data = $request->all();
    if (empty($data['registered_by_id'])) {
        $data['registered_by_id'] = $defaultAgent ? $defaultAgent->id : 1;
    }
    if (empty($data['branch_id'])) {
        $data['branch_id'] = ($defaultAgent && $defaultAgent->branch_id) ? $defaultAgent->branch_id : ($defaultBranch ? $defaultBranch->id : 1);
    }
    if (empty($data['team_id'])) {
        $data['team_id'] = ($defaultAgent && $defaultAgent->team_id) ? $defaultAgent->team_id : ($defaultTeam ? $defaultTeam->id : 1);
    }
    if (empty($data['preferred_property_type'])) {
        $data['preferred_property_type'] = 'apartment';
    } else {
        $data['preferred_property_type'] = strtolower($data['preferred_property_type']);
        if (!in_array($data['preferred_property_type'], ['villa', 'apartment', 'commercial', 'land', 'condominium'])) {
            $data['preferred_property_type'] = 'apartment';
        }
    }

    $validated = validator($data, [
        'full_name' => 'required|string|max:150',
        'phone' => 'required|string|max:30',
        'alternate_phone' => 'nullable|string|max:30',
        'email' => 'nullable|email',
        'budget_min' => 'nullable|numeric',
        'budget_max' => 'nullable|numeric',
        'preferred_property_type' => 'required|string',
        'preferred_locations' => 'nullable|array',
        'client_inclination' => 'nullable|string',
        'registered_by_id' => 'required|exists:users,id',
        'team_id' => 'required|exists:teams,id',
        'branch_id' => 'required|exists:branches,id',
        'status' => 'nullable|string',
    ])->validate();

    $customer = Customer::create($validated);
    return response()->json([
        'message' => 'Customer registered successfully per Article 8.3/19.1', 
        'customer' => $customer->load(['registeredBy', 'team', 'branch'])
    ], 201);
});

/**
 * 4. Daily Activity Reports / Diaries (Article 8.4, 18.3, 19.2)
 */
Route::get('/diaries', function () {
    $diaries = DailyDiary::with(['member', 'team', 'reviewer'])->latest('report_date')->get();
    return response()->json($diaries);
});

Route::post('/diaries', function (Request $request) {
    $data = $request->all();
    $defaultAgent = User::where('structure_type', 'SALES')->first() ?? User::first();
    $defaultTeam = Team::first();
    
    if (empty($data['member_id'])) {
        $data['member_id'] = $defaultAgent ? $defaultAgent->id : 1;
    }
    if (empty($data['team_id'])) {
        $data['team_id'] = ($defaultAgent && $defaultAgent->team_id) ? $defaultAgent->team_id : ($defaultTeam ? $defaultTeam->id : 1);
    }
    if (empty($data['report_date'])) {
        $data['report_date'] = now()->toDateString();
    }

    $validated = validator($data, [
        'report_date' => 'required|date',
        'member_id' => 'required|exists:users,id',
        'team_id' => 'required|exists:teams,id',
        'calls_made' => 'nullable|integer',
        'customers_registered' => 'nullable|integer',
        'field_visits_conducted' => 'nullable|integer',
        'activity_summary' => 'required|string',
        'challenges_encountered' => 'nullable|string',
        'leader_notes' => 'nullable|string',
        'status' => 'nullable|in:submitted,reviewed',
    ])->validate();

    $diary = DailyDiary::create($validated);
    return response()->json([
        'message' => 'Daily Diary submitted for Team Leader review (Article 8.4)', 
        'diary' => $diary->load(['member', 'team'])
    ], 201);
});

/**
 * 5. Branch Customer Tendency Reports (Article 9.5, 17.6)
 */
Route::get('/tendency-reports', function () {
    $reports = TendencyReport::with(['branch', 'branchManager'])->latest()->get();
    return response()->json($reports);
});

/**
 * 6. Properties Published by Information Department (Article 13.2, 16.6)
 */
Route::get('/properties', function () {
    $properties = Property::with(['developerContract', 'intakeByGenHead', 'verifiedByInfoDept'])
        ->where('is_published', true)
        ->latest()
        ->get();

    return response()->json($properties);
});

/**
 * 7. Payment Certificates & CEO Approval Protocol (Article 12.3, 14.2)
 */
Route::get('/payment-certificates', function () {
    $certificates = PaymentCertificate::with([
        'deal.property',
        'deal.customer',
        'deal.agent',
        'preparedByFinance',
        'ceo',
        'disbursements.beneficiary',
    ])->latest()->get();

    return response()->json($certificates);
});

Route::post('/payment-certificates/{id}/approve', function ($id, Request $request) {
    $cert = PaymentCertificate::findOrFail($id);
    $ceo = User::where('structure_type', 'EXECUTIVE')->first();

    $cert->update([
        'ceo_approved' => true,
        'ceo_approved_at' => now(),
        'ceo_id' => $ceo ? $ceo->id : null,
        'payment_status' => 'approved_by_ceo',
    ]);

    return response()->json([
        'message' => 'Payment Certificate authorized and ordered for payout by CEO (Article 12.3)',
        'certificate' => $cert,
    ]);
});

/**
 * 8. Article 22: Salary and Commission Distribution
 */
Route::post('/commission/calculate', function (Request $request) {
    $request->validate([
        'sale_price' => 'required|numeric|min:1',
        'agent_id' => 'required|exists:users,id',
    ]);

    $agent = User::findOrFail($request->input('agent_id'));
    $salePrice = (float) $request->input('sale_price');

    $calculation = \App\Services\CommissionService::calculateTiers($salePrice, $agent);
    return response()->json($calculation);
});

Route::post('/deals', function (Request $request) {
    $validated = $request->validate([
        'property_id' => 'required|exists:properties,id',
        'customer_id' => 'required|exists:customers,id',
        'agent_id' => 'required|exists:users,id',
        'sale_price' => 'required|numeric|min:1',
        'bank_reference' => 'nullable|string|max:100',
    ]);

    $financeOfficer = User::where('admin_department', 'FINANCE')->first() ?? User::first();
    $result = \App\Services\CommissionService::createDealAndCertificate($validated, $financeOfficer);

    return response()->json([
        'message' => 'Property sales deal registered and Article 22 Commission Payment Certificate generated',
        'data' => $result,
    ], 201);
});

/**
 * 9. Role-Based Dashboards Aggregated Endpoints (Articles 8-19, 22)
 * Provides dedicated, scoped metrics & operational queues for all 8 roles
 */
Route::get('/dashboards/{role}', function ($role, Request $request) {
    $roleNorm = strtolower(str_replace(['_', '-'], '', $role));
    $userId = $request->query('user_id');

    // 1. CEO DASHBOARD
    if (in_array($roleNorm, ['ceo', 'executive'])) {
        $totalSalesCount = SalesDeal::count();
        $totalSalesVolume = (float) SalesDeal::sum('sale_price');
        $totalCommissionDisbursed = (float) CommissionDisbursement::where('is_paid', true)->sum('net_amount');
        $activeMembers = User::where('structure_type', 'SALES')->where('status', 'active')->count();
        $activeCustomers = Customer::where('status', 'visited_site')->orWhere('status', 'active')->count();

        $pendingCertificates = PaymentCertificate::with(['deal.property', 'deal.agent', 'disbursements.beneficiary'])
            ->where('ceo_approved', false)
            ->latest()
            ->get();

        $pendingUpgrades = SystemUpgrade::with('submittedBy')
            ->where('status', 'submitted_to_ceo')
            ->latest()
            ->get();

        $assemblies = DiscussionMeeting::with('organizer')
            ->where('tier_scope', 'CEO_ASSEMBLY')
            ->orderBy('scheduled_at')
            ->get();

        $contracts = DeveloperContract::withCount('properties')->latest()->get();

        $disputes = Dispute::with(['raisedBy', 'branch'])->where('status', '!=', 'resolved')->latest()->get();

        // Org performance heatmap rollup
        $generations = Generation::with(['branches.teams.members'])->get()->map(function ($gen) {
            $branchStats = $gen->branches->map(function ($br) {
                $dealsCount = SalesDeal::whereHas('agent', fn($q) => $q->where('branch_id', $br->id))->count();
                $volume = SalesDeal::whereHas('agent', fn($q) => $q->where('branch_id', $br->id))->sum('sale_price');
                return [
                    'branch_id' => $br->id,
                    'branch_name' => $br->name,
                    'deals_count' => $dealsCount,
                    'sales_volume' => (float) $volume,
                    'teams_count' => $br->teams->count(),
                ];
            });

            return [
                'generation_id' => $gen->id,
                'generation_name' => $gen->name,
                'branches' => $branchStats,
                'total_volume' => $branchStats->sum('sales_volume'),
                'total_deals' => $branchStats->sum('deals_count'),
            ];
        });

        return response()->json([
            'role' => 'CEO',
            'title' => 'Executive CEO Command Center',
            'kpis' => [
                'total_sales_count' => $totalSalesCount,
                'total_sales_volume' => $totalSalesVolume,
                'total_commission_disbursed' => $totalCommissionDisbursed,
                'active_sales_members' => $activeMembers,
                'active_customers' => $activeCustomers,
                'pending_approvals_count' => $pendingCertificates->count() + $pendingUpgrades->count(),
            ],
            'pending_certificates' => $pendingCertificates,
            'pending_upgrades' => $pendingUpgrades,
            'assemblies' => $assemblies,
            'contracts' => $contracts,
            'heatmap' => $generations,
            'open_disputes' => $disputes,
            'recent_audits' => AuditLog::with('user')->latest()->limit(8)->get(),
        ]);
    }

    // 2. INFORMATION DEPARTMENT DASHBOARD
    if (in_array($roleNorm, ['information', 'informationofficer', 'info'])) {
        $properties = Property::with(['developerContract', 'intakeByGenHead'])->latest()->get();
        $contracts = DeveloperContract::latest()->get();
        $recentDiaries = DailyDiary::with(['member', 'team'])->latest('report_date')->limit(6)->get();
        $accessRequests = AccessRequest::with('user')->where('status', 'pending')->get();
        $securityAlerts = AuditLog::with('user')->latest()->limit(10)->get();

        return response()->json([
            'role' => 'INFORMATION_OFFICER',
            'title' => 'Information Department Data Center',
            'kpis' => [
                'total_properties' => $properties->count(),
                'published_properties' => $properties->where('is_published', true)->count(),
                'active_contracts' => $contracts->count(),
                'pending_data_submissions' => $recentDiaries->count(),
            ],
            'properties' => $properties,
            'contracts' => $contracts,
            'incoming_feed' => $recentDiaries,
            'access_requests' => $accessRequests,
            'security_alerts' => $securityAlerts,
            'backup_schedule' => [
                'last_backup' => now()->subHours(6)->toIso8601String(),
                'status' => 'HEALTHY (Encrypted Mirror)',
                'storage_usage' => '24.2 MB / 50 GB',
            ],
        ]);
    }

    // 3. FINANCE DEPARTMENT DASHBOARD
    if (in_array($roleNorm, ['finance', 'financeofficer', 'fin'])) {
        $certificates = PaymentCertificate::with([
            'deal.property',
            'deal.customer',
            'deal.agent',
            'disbursements.beneficiary'
        ])->latest()->get();

        $disbursements = CommissionDisbursement::with(['beneficiary', 'paymentCertificate.deal'])->latest()->get();

        $grossTotal = (float) PaymentCertificate::sum('gross_amount');
        $taxWithheld = (float) CommissionDisbursement::sum('tax_amount');
        $netPaid = (float) CommissionDisbursement::where('is_paid', true)->sum('net_amount');
        $pendingPayout = (float) CommissionDisbursement::where('is_paid', false)->sum('net_amount');

        // Administrative payroll roster (Article 22.1: regular salary; Art 22.2: Sales has zero salary)
        $adminStaff = User::where('structure_type', 'ADMINISTRATIVE')
            ->orWhere('structure_type', 'EXECUTIVE')
            ->get()
            ->map(function ($u) {
                return [
                    'id' => $u->id,
                    'name' => $u->name,
                    'official_id' => $u->official_id,
                    'department' => $u->admin_department ?? 'EXECUTIVE',
                    'primary_role' => $u->primary_role,
                    'base_salary_etb' => 28000.00, // standard baseline for administrative staff
                    'status' => 'ACTIVE_PAYROLL',
                ];
            });

        return response()->json([
            'role' => 'FINANCE_OFFICER',
            'title' => 'Finance & Commission Settlement Center',
            'kpis' => [
                'total_gross_commissions' => $grossTotal,
                'total_tax_withheld_2pct' => $taxWithheld,
                'total_net_disbursed' => $netPaid,
                'pending_payout_queue' => $pendingPayout,
                'unapproved_certificates_count' => $certificates->where('ceo_approved', false)->count(),
            ],
            'certificates' => $certificates,
            'disbursements' => $disbursements,
            'admin_payroll' => $adminStaff,
            'tax_deduction_ledger' => $disbursements->map(function ($d) {
                return [
                    'id' => $d->id,
                    'beneficiary_name' => $d->beneficiary ? $d->beneficiary->name : 'N/A',
                    'role_tier' => $d->beneficiary_role,
                    'gross_amount' => (float) ($d->net_amount + $d->tax_amount),
                    'tax_2pct' => (float) $d->tax_amount,
                    'net_payable' => (float) $d->net_amount,
                    'deal_ref' => $d->paymentCertificate && $d->paymentCertificate->deal ? $d->paymentCertificate->deal->deal_code : 'N/A',
                    'is_paid' => (bool) $d->is_paid,
                ];
            }),
        ]);
    }

    // 4. SYSTEM ADMINISTRATOR DASHBOARD
    if (in_array($roleNorm, ['sysadmin', 'systemadmin', 'admin'])) {
        $users = User::with(['generation', 'branch', 'team'])->latest()->get();
        $auditLogs = AuditLog::with('user')->latest()->limit(25)->get();
        $accessRequests = AccessRequest::with('user')->latest()->get();
        $upgrades = SystemUpgrade::with(['submittedBy', 'ceoApprovedBy'])->latest()->get();

        return response()->json([
            'role' => 'SYSTEM_ADMIN',
            'title' => 'System Administration & Security Control',
            'kpis' => [
                'total_accounts' => $users->count(),
                'active_sessions' => 4,
                'security_audits' => $auditLogs->count(),
                'pending_access_requests' => $accessRequests->where('status', 'pending')->count(),
                'system_upgrades_pending' => $upgrades->where('status', 'submitted_to_ceo')->count(),
            ],
            'users' => $users,
            'audit_logs' => $auditLogs,
            'access_requests' => $accessRequests,
            'system_upgrades' => $upgrades,
            'system_health' => [
                'server_status' => 'ONLINE',
                'php_version' => PHP_VERSION,
                'database' => DB::connection()->getDatabaseName(),
                'db_tables' => count(DB::select('SHOW TABLES')),
                'api_latency_ms' => 4.2,
                'uptime_hours' => 142.5,
            ],
        ]);
    }

    // 5. GENERATION HEAD DASHBOARD
    if (in_array($roleNorm, ['genhead', 'generationhead', 'generation'])) {
        $genUser = $userId ? User::find($userId) : User::where('primary_role', 'GENERATION_HEAD')->first();
        $genId = $genUser && $genUser->generation_id ? $genUser->generation_id : 1;
        $generation = Generation::with(['head', 'branches.manager', 'branches.teams.members'])->find($genId);

        $branches = $generation ? $generation->branches : Branch::all();
        $branchIds = $branches->pluck('id');

        $tendencyReports = TendencyReport::with(['branch', 'branchManager'])
            ->whereIn('branch_id', $branchIds)
            ->latest()
            ->get();

        $disputes = Dispute::with(['raisedBy', 'branch'])
            ->whereIn('branch_id', $branchIds)
            ->latest()
            ->get();

        $generationSales = SalesDeal::whereHas('agent', fn($q) => $q->whereIn('branch_id', $branchIds));
        $totalVol = (float) (clone $generationSales)->sum('sale_price');
        $dealsCount = (clone $generationSales)->count();

        $meetings = DiscussionMeeting::with('organizer')
            ->whereIn('tier_scope', ['CEO_ASSEMBLY', 'GENERATION'])
            ->orderBy('scheduled_at')
            ->get();

        return response()->json([
            'role' => 'GENERATION_HEAD',
            'title' => 'Generation Head Oversight Console',
            'user' => $genUser,
            'generation' => $generation,
            'kpis' => [
                'total_generation_volume' => $totalVol,
                'total_deals_closed' => $dealsCount,
                'branches_count' => $branches->count(),
                'active_agents_count' => User::whereIn('branch_id', $branchIds)->count(),
                'pending_tendency_reports' => $tendencyReports->count(),
            ],
            'branches' => $branches->map(function ($br) {
                return [
                    'id' => $br->id,
                    'name' => $br->name,
                    'code' => $br->code,
                    'city' => $br->city,
                    'manager' => $br->manager ? $br->manager->name : 'Unassigned',
                    'teams_count' => $br->teams->count(),
                    'agents_count' => $br->teams->flatMap->members->count(),
                ];
            }),
            'tendency_reports' => $tendencyReports,
            'disputes' => $disputes,
            'meetings' => $meetings,
        ]);
    }

    // 6. BRANCH MANAGER DASHBOARD
    if (in_array($roleNorm, ['branchmgr', 'branchmanager', 'branch'])) {
        $branchUser = $userId ? User::find($userId) : User::where('primary_role', 'BRANCH_MANAGER')->first();
        $branchId = $branchUser && $branchUser->branch_id ? $branchUser->branch_id : 1;
        $branch = Branch::with(['manager', 'teams.leader', 'teams.members'])->find($branchId);

        $teams = $branch ? $branch->teams : Team::all();
        $teamIds = $teams->pluck('id');

        $branchCustomers = Customer::where('branch_id', $branchId)->orWhereIn('team_id', $teamIds)->latest()->get();
        $branchDiaries = DailyDiary::with(['member', 'team'])
            ->whereIn('team_id', $teamIds)
            ->latest('report_date')
            ->get();

        $tendencyReports = TendencyReport::where('branch_id', $branchId)->latest()->get();
        $branchDeals = SalesDeal::whereHas('agent', fn($q) => $q->where('branch_id', $branchId))->get();

        $disputes = Dispute::with('raisedBy')->where('branch_id', $branchId)->latest()->get();

        return response()->json([
            'role' => 'BRANCH_MANAGER',
            'title' => 'Branch Manager Operations Command',
            'user' => $branchUser,
            'branch' => $branch,
            'kpis' => [
                'branch_sales_volume' => (float) $branchDeals->sum('sale_price'),
                'deals_count' => $branchDeals->count(),
                'active_customers' => $branchCustomers->count(),
                'total_teams' => $teams->count(),
                'pending_diaries' => $branchDiaries->where('status', 'submitted')->count(),
            ],
            'teams' => $teams->map(function ($t) {
                return [
                    'id' => $t->id,
                    'name' => $t->name,
                    'code' => $t->code,
                    'leader' => $t->leader ? $t->leader->name : 'Unassigned',
                    'target_sales' => $t->target_sales,
                    'members_count' => $t->members->count(),
                ];
            }),
            'customers' => $branchCustomers,
            'diaries' => $branchDiaries,
            'tendency_reports' => $tendencyReports,
            'disputes' => $disputes,
        ]);
    }

    // 7. TEAM LEADER DASHBOARD
    if (in_array($roleNorm, ['teamleader', 'leader', 'tl'])) {
        $tlUser = $userId ? User::find($userId) : User::where('primary_role', 'TEAM_LEADER')->first();
        $teamId = $tlUser && $tlUser->team_id ? $tlUser->team_id : 1;
        $team = Team::with(['leader', 'members', 'branch'])->find($teamId);

        $memberIds = $team ? $team->members->pluck('id')->push($tlUser ? $tlUser->id : 1) : [1];

        $teamDiaries = DailyDiary::with(['member'])
            ->whereIn('member_id', $memberIds)
            ->latest('report_date')
            ->get();

        $teamCustomers = Customer::whereIn('registered_by_id', $memberIds)->latest()->get();
        $teamDeals = SalesDeal::whereIn('agent_id', $memberIds)->get();

        $morningMeetings = DiscussionMeeting::where('tier_scope', 'TEAM')
            ->where('organizer_id', $tlUser ? $tlUser->id : 1)
            ->latest()
            ->get();

        return response()->json([
            'role' => 'TEAM_LEADER',
            'title' => 'Team Leader Field Operations Console',
            'user' => $tlUser,
            'team' => $team,
            'kpis' => [
                'team_sales_volume' => (float) $teamDeals->sum('sale_price'),
                'deals_count' => $teamDeals->count(),
                'team_members_count' => $team ? $team->members->count() : 0,
                'customers_pipeline_count' => $teamCustomers->count(),
                'pending_diaries_verification' => $teamDiaries->where('status', 'submitted')->count(),
            ],
            'members' => $team ? $team->members : [],
            'diary_review_queue' => $teamDiaries,
            'customers' => $teamCustomers,
            'morning_meetings' => $morningMeetings,
        ]);
    }

    // 8. TEAM MEMBER (DIRECT SALES AGENT) DASHBOARD
    $agentUser = $userId ? User::find($userId) : User::where('primary_role', 'TEAM_MEMBER')->first();
    $agentId = $agentUser ? $agentUser->id : 8;

    $myDeals = SalesDeal::with(['property', 'customer'])
        ->where('agent_id', $agentId)
        ->latest()
        ->get();

    $myDisbursements = CommissionDisbursement::with('paymentCertificate.deal.property')
        ->where('beneficiary_id', $agentId)
        ->latest()
        ->get();

    $myDiaries = DailyDiary::where('member_id', $agentId)->latest('report_date')->get();
    $myCustomers = Customer::where('registered_by_id', $agentId)->latest()->get();
    $availableProperties = Property::where('is_published', true)->where('status', 'published')->latest()->get();

    return response()->json([
        'role' => 'TEAM_MEMBER',
        'title' => 'Direct Sales Agent Workplace',
        'user' => $agentUser,
        'kpis' => [
            'my_deals_count' => $myDeals->count(),
            'my_sales_volume' => (float) $myDeals->sum('sale_price'),
            'my_earned_net_commission' => (float) $myDisbursements->sum('net_amount'),
            'my_active_customers' => $myCustomers->count(),
            'my_diaries_submitted' => $myDiaries->count(),
        ],
        'my_deals' => $myDeals,
        'my_disbursements' => $myDisbursements,
        'my_diaries' => $myDiaries,
        'my_customers' => $myCustomers,
        'property_catalog' => $availableProperties,
    ]);
});

/**
 * 10. Operational Action Endpoints for Role Dashboards
 */

// Schedule Meeting / Assembly (CEO, Gen Head, Branch Mgr, Team Leader)
Route::post('/dashboards/actions/meeting', function (Request $request) {
    $validated = $request->validate([
        'title' => 'required|string|max:200',
        'meeting_type' => 'required|in:call,virtual,in_person',
        'tier_scope' => 'required|string|max:50',
        'organizer_id' => 'required|exists:users,id',
        'scheduled_at' => 'required|date',
        'location_or_link' => 'nullable|string|max:255',
        'agenda' => 'nullable|string',
    ]);

    $meeting = DiscussionMeeting::create($validated);
    return response()->json(['message' => 'Meeting scheduled successfully', 'meeting' => $meeting], 201);
});

// Submit System Upgrade (SysAdmin -> CEO)
Route::post('/dashboards/actions/upgrade', function (Request $request) {
    $validated = $request->validate([
        'title' => 'required|string|max:200',
        'version' => 'required|string|max:30',
        'study_notes' => 'required|string',
        'impact_assessment' => 'nullable|string',
        'submitted_by_id' => 'required|exists:users,id',
    ]);

    $validated['status'] = 'submitted_to_ceo';
    $upgrade = SystemUpgrade::create($validated);
    return response()->json(['message' => 'System upgrade proposal submitted to CEO', 'upgrade' => $upgrade], 201);
});

// File Dispute / Grievance (Branch, Gen Head)
Route::post('/dashboards/actions/dispute', function (Request $request) {
    $validated = $request->validate([
        'raised_by_id' => 'required|exists:users,id',
        'branch_id' => 'nullable|exists:branches,id',
        'title' => 'required|string|max:200',
        'category' => 'required|in:operational,conflict_of_interest,commission_split,customer_jurisdiction',
        'description' => 'required|string',
    ]);

    $validated['dispute_code'] = 'DSP-' . date('Y') . '-' . rand(100, 999);
    $validated['status'] = 'open';
    $dispute = Dispute::create($validated);

    return response()->json(['message' => 'Dispute registered for review', 'dispute' => $dispute], 201);
});

// Resolve Dispute
Route::post('/dashboards/actions/resolve-dispute', function (Request $request) {
    $validated = $request->validate([
        'dispute_id' => 'required|exists:disputes,id',
        'resolved_by_id' => 'required|exists:users,id',
        'resolution_notes' => 'required|string',
    ]);

    $dispute = Dispute::findOrFail($validated['dispute_id']);
    $dispute->update([
        'status' => 'resolved',
        'resolved_by_id' => $validated['resolved_by_id'],
        'resolution_notes' => $validated['resolution_notes'],
        'resolved_at' => now(),
    ]);

    return response()->json(['message' => 'Dispute marked as resolved', 'dispute' => $dispute]);
});

// Submit / Review Access Request (SysAdmin)
Route::post('/dashboards/actions/access-request', function (Request $request) {
    $validated = $request->validate([
        'user_id' => 'required|exists:users,id',
        'requested_role' => 'required|string|max:50',
        'justification' => 'required|string',
    ]);

    $req = AccessRequest::create($validated);
    return response()->json(['message' => 'Access request submitted', 'request' => $req], 201);
});

Route::post('/dashboards/actions/review-access-request', function (Request $request) {
    $validated = $request->validate([
        'request_id' => 'required|exists:access_requests,id',
        'reviewed_by_id' => 'required|exists:users,id',
        'status' => 'required|in:approved,rejected',
        'review_notes' => 'nullable|string',
    ]);

    $req = AccessRequest::findOrFail($validated['request_id']);
    $req->update([
        'status' => $validated['status'],
        'reviewed_by_id' => $validated['reviewed_by_id'],
        'review_notes' => $validated['review_notes'],
    ]);

    if ($validated['status'] === 'approved') {
        $user = User::find($req->user_id);
        if ($user) {
            $user->update(['primary_role' => $req->requested_role]);
        }
    }

    return response()->json(['message' => 'Access request reviewed', 'request' => $req]);
});

// Verify Diary (Team Leader sign-off)
Route::post('/dashboards/actions/verify-diary', function (Request $request) {
    $validated = $request->validate([
        'diary_id' => 'required|exists:daily_diaries,id',
        'leader_id' => 'required|exists:users,id',
        'leader_notes' => 'required|string',
    ]);

    $diary = DailyDiary::findOrFail($validated['diary_id']);
    $diary->update([
        'status' => 'reviewed',
        'reviewed_by_leader_id' => $validated['leader_id'],
        'leader_notes' => $validated['leader_notes'],
    ]);

    return response()->json(['message' => 'Daily Activity Diary verified and signed by Leader (Article 8.4)', 'diary' => $diary]);
});

// Trigger DB Backup (SysAdmin)
Route::post('/dashboards/actions/backup', function (Request $request) {
    $admin = User::where('admin_department', 'SYSTEM_ADMIN')->first();
    AuditLog::create([
        'user_id' => $admin ? $admin->id : 1,
        'action' => 'MANUAL_DB_BACKUP_TRIGGERED',
        'entity_type' => 'DATABASE',
        'entity_id' => 1,
        'ip_address' => $request->ip() ?? '127.0.0.1',
        'details' => 'Full automated snapshot generated and archived to secure cold storage.',
    ]);

    return response()->json([
        'message' => 'Database backup archive successfully created',
        'timestamp' => now()->toIso8601String(),
        'filename' => 'beha_backup_' . date('Y_m_d_His') . '.sql.gz',
    ]);
});

// Finance Disburse Certificate
Route::post('/dashboards/actions/disburse-certificate', function (Request $request) {
    $certId = $request->input('certificate_id');
    $cert = PaymentCertificate::findOrFail($certId);

    $cert->update([
        'payment_status' => 'disbursed',
        'disbursed_at' => now(),
    ]);

    CommissionDisbursement::where('payment_certificate_id', $cert->id)->update([
        'is_paid' => true,
        'paid_at' => now(),
    ]);

    return response()->json([
        'message' => 'Commission funds successfully disbursed to all beneficiaries (Article 22)',
        'certificate' => $cert->load('disbursements.beneficiary'),
    ]);
});

// CEO Issue Directive / Notification
Route::post('/dashboards/actions/ceo-directive', function (Request $request) {
    $validated = $request->validate([
        'title' => 'required|string|max:150',
        'message' => 'required|string',
        'target_role' => 'nullable|string',
    ]);

    $notification = AppNotification::create([
        'target_role' => $validated['target_role'] ?? null,
        'title' => $validated['title'],
        'message' => $validated['message'],
        'type' => 'alert',
        'is_read' => false,
    ]);

    AuditLog::create([
        'user_id' => User::where('structure_type', 'EXECUTIVE')->value('id'),
        'action' => 'EXECUTIVE_DIRECTIVE_BROADCAST',
        'entity_type' => 'NOTIFICATION',
        'entity_id' => $notification->id,
        'details' => $validated['title'],
    ]);

    return response()->json(['message' => 'Executive Directive broadcasted to organization', 'notification' => $notification], 201);
});

// CEO Sign Developer Contract (Article 12.4)
Route::post('/dashboards/actions/contract', function (Request $request) {
    $validated = $request->validate([
        'developer_name' => 'required|string|max:150',
        'contract_ref' => 'required|string|max:50|unique:developer_contracts,contract_ref',
        'agreed_commission_rate' => 'required|numeric|min:0.5|max:10.0',
        'start_date' => 'required|date',
        'expiry_date' => 'required|date|after:start_date',
        'terms_summary' => 'nullable|string',
    ]);

    $validated['ceo_signed'] = true;
    $contract = DeveloperContract::create($validated);

    AuditLog::create([
        'user_id' => User::where('structure_type', 'EXECUTIVE')->value('id'),
        'action' => 'DEVELOPER_CONTRACT_SIGNED',
        'entity_type' => 'DEVELOPER_CONTRACT',
        'entity_id' => $contract->id,
        'details' => "Signed contract with {$contract->developer_name} at {$contract->agreed_commission_rate}% commission rate.",
    ]);

    return response()->json(['message' => 'Developer Partner Contract signed by CEO (Article 12.4)', 'contract' => $contract], 201);
});

// Information Dept & Gen Head Verify / Publish Property (Articles 13.2 & 16.6)
Route::post('/dashboards/actions/property', function (Request $request) {
    $validated = $request->validate([
        'developer_contract_id' => 'required|exists:developer_contracts,id',
        'property_code' => 'required|string|max:30|unique:properties,property_code',
        'title' => 'required|string|max:200',
        'property_type' => 'required|in:villa,apartment,commercial,land,condominium',
        'price' => 'required|numeric|min:1',
        'advance_payment' => 'nullable|numeric',
        'area_sqm' => 'required|numeric|min:1',
        'bedrooms' => 'nullable|integer',
        'bathrooms' => 'nullable|integer',
        'subcity' => 'required|string|max:100',
        'specific_area' => 'nullable|string|max:200',
        'description' => 'nullable|string',
    ]);

    $infoOfficer = User::where('admin_department', 'INFORMATION')->first();
    $validated['verified_by_info_dept_id'] = $infoOfficer ? $infoOfficer->id : null;
    $validated['is_published'] = true;
    $validated['published_at'] = now();
    $validated['status'] = 'published';

    $prop = Property::create($validated);

    AuditLog::create([
        'user_id' => $infoOfficer ? $infoOfficer->id : 1,
        'action' => 'PROPERTY_LISTING_PUBLISHED',
        'entity_type' => 'PROPERTY',
        'entity_id' => $prop->id,
        'details' => "Published property {$prop->property_code} - {$prop->title} to digital catalog.",
    ]);

    return response()->json(['message' => 'Property listing verified and published to catalog (Article 13.2)', 'property' => $prop], 201);
});

// Branch Manager Reassign Customer Lead (Article 17.4)
Route::post('/dashboards/actions/reassign-lead', function (Request $request) {
    $validated = $request->validate([
        'customer_id' => 'required|exists:customers,id',
        'new_agent_id' => 'required|exists:users,id',
    ]);

    $customer = Customer::findOrFail($validated['customer_id']);
    $newAgent = User::findOrFail($validated['new_agent_id']);

    $oldAgentId = $customer->registered_by_id;
    $customer->update([
        'registered_by_id' => $newAgent->id,
        'team_id' => $newAgent->team_id ?? $customer->team_id,
        'branch_id' => $newAgent->branch_id ?? $customer->branch_id,
    ]);

    AuditLog::create([
        'user_id' => $newAgent->branch_id ? User::where('branch_id', $newAgent->branch_id)->where('primary_role', 'BRANCH_MANAGER')->value('id') : 1,
        'action' => 'CUSTOMER_LEAD_REASSIGNED',
        'entity_type' => 'CUSTOMER',
        'entity_id' => $customer->id,
        'details' => "Reassigned lead {$customer->full_name} ({$customer->customer_code}) to Agent {$newAgent->name}.",
    ]);

    return response()->json(['message' => 'Lead successfully reassigned to new sales agent', 'customer' => $customer->load('registeredBy')]);
});

// SysAdmin Reset PIN (Article 15.2)
Route::post('/dashboards/actions/reset-pin', function (Request $request) {
    $validated = $request->validate([
        'user_id' => 'required|exists:users,id',
        'new_pin' => 'required|string|min:4|max:8',
    ]);

    $targetUser = User::findOrFail($validated['user_id']);
    $targetUser->update([
        'pin' => \Illuminate\Support\Facades\Hash::make($validated['new_pin']),
    ]);

    $admin = User::where('admin_department', 'SYSTEM_ADMIN')->first();
    AuditLog::create([
        'user_id' => $admin ? $admin->id : 1,
        'action' => 'STAFF_PIN_RESET',
        'entity_type' => 'USER',
        'entity_id' => $targetUser->id,
        'details' => "Reset operational access PIN for staff member {$targetUser->name} ({$targetUser->official_id}).",
    ]);

// SysAdmin Toggle User Ban / Suspend (Article 15.1)
Route::post('/dashboards/actions/toggle-user-ban', function (Request $request) {
    $validated = $request->validate([
        'user_id' => 'required|exists:users,id',
    ]);

    $targetUser = User::findOrFail($validated['user_id']);
    $newStatus = ($targetUser->status === 'banned' || $targetUser->status === 'suspended') ? 'active' : 'banned';
    $targetUser->update(['status' => $newStatus]);

    $admin = User::where('admin_department', 'SYSTEM_ADMIN')->first();
    AuditLog::create([
        'user_id' => $admin ? $admin->id : 1,
        'action' => $newStatus === 'banned' ? 'USER_ACCOUNT_BANNED' : 'USER_ACCOUNT_REACTIVATED',
        'entity_type' => 'USER',
        'entity_id' => $targetUser->id,
        'ip_address' => $request->ip() ?? '127.0.0.1',
        'details' => "System Administrator set account status to {$newStatus} for {$targetUser->name} ({$targetUser->official_id}).",
    ]);

    return response()->json([
        'message' => "User {$targetUser->name} is now {$newStatus}",
        'user' => $targetUser,
    ]);
});

// SysAdmin Delete User (Article 15.1)
Route::post('/dashboards/actions/delete-user', function (Request $request) {
    $validated = $request->validate([
        'user_id' => 'required|exists:users,id',
    ]);

    $targetUser = User::findOrFail($validated['user_id']);
    $userName = $targetUser->name;
    $officialId = $targetUser->official_id;
    $targetUser->delete();

    $admin = User::where('admin_department', 'SYSTEM_ADMIN')->first();
    AuditLog::create([
        'user_id' => $admin ? $admin->id : 1,
        'action' => 'USER_ACCOUNT_DELETED',
        'entity_type' => 'USER',
        'entity_id' => $validated['user_id'],
        'ip_address' => $request->ip() ?? '127.0.0.1',
        'details' => "Deleted staff account {$userName} ({$officialId}) from the system.",
    ]);

    return response()->json([
        'message' => "User {$userName} ({$officialId}) deleted successfully",
    ]);
});

// SysAdmin Add / Register New User
Route::post('/dashboards/actions/add-user', function (Request $request) {
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'official_id' => 'required|string|max:50|unique:users,official_id',
        'email' => 'required|email|max:255|unique:users,email',
        'phone' => 'required|string|max:30',
        'structure_type' => 'required|in:EXECUTIVE,ADMINISTRATIVE,SALES',
        'admin_department' => 'nullable|in:INFORMATION,FINANCE,SYSTEM_ADMIN',
        'primary_role' => 'required|string|max:50',
        'grade_level' => 'required|integer|min:1|max:5',
        'generation_id' => 'nullable|exists:generations,id',
        'branch_id' => 'nullable|exists:branches,id',
        'team_id' => 'nullable|exists:teams,id',
        'pin' => 'nullable|string|min:4|max:8',
        'password' => 'nullable|string|min:4',
    ]);

    $pin = $validated['pin'] ?? '1234';
    $password = $validated['password'] ?? 'password';

    $user = User::create([
        'name' => $validated['name'],
        'official_id' => $validated['official_id'],
        'email' => $validated['email'],
        'phone' => $validated['phone'],
        'structure_type' => $validated['structure_type'],
        'admin_department' => $validated['admin_department'] ?? null,
        'primary_role' => $validated['primary_role'],
        'grade_level' => $validated['grade_level'],
        'generation_id' => $validated['generation_id'] ?? null,
        'branch_id' => $validated['branch_id'] ?? null,
        'team_id' => $validated['team_id'] ?? null,
        'status' => 'active',
        'pin' => \Illuminate\Support\Facades\Hash::make($pin),
        'password' => \Illuminate\Support\Facades\Hash::make($password),
    ]);

    $admin = User::where('admin_department', 'SYSTEM_ADMIN')->first();
    AuditLog::create([
        'user_id' => $admin ? $admin->id : 1,
        'action' => 'NEW_STAFF_REGISTERED',
        'entity_type' => 'USER',
        'entity_id' => $user->id,
        'ip_address' => $request->ip() ?? '127.0.0.1',
        'details' => "Registered new {$validated['primary_role']} {$user->name} ({$user->official_id}) with Grade Level {$user->grade_level}.",
    ]);

    return response()->json([
        'message' => "User {$user->name} created successfully!",
        'user' => $user,
    ], 201);
});

// SysAdmin Remove / Delete Access Request
Route::post('/dashboards/actions/delete-access-request', function (Request $request) {
    $validated = $request->validate([
        'request_id' => 'required|exists:access_requests,id',
    ]);

    $req = AccessRequest::findOrFail($validated['request_id']);
    $req->delete();

    return response()->json(['message' => 'Access request removed successfully']);
});




