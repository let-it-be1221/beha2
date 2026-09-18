<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Generation;
use App\Models\Branch;
use App\Models\Team;
use App\Models\DeveloperContract;
use App\Models\Property;
use App\Models\Customer;
use App\Models\DailyDiary;
use App\Models\TendencyReport;
use App\Models\SalesDeal;
use App\Models\PaymentCertificate;
use App\Models\CommissionDisbursement;
use App\Models\AuditLog;
use App\Models\AccessRequest;
use App\Models\DiscussionMeeting;
use App\Models\Dispute;
use App\Models\SystemUpgrade;
use App\Models\AppNotification;

class BehaOrganizationalSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Executive Structure (Article 12: Highest Authority)
        $ceo = User::create([
            'official_id' => 'BH-CEO-001',
            'name' => 'Dawit Gebremariam (CEO)',
            'email' => 'ceo@beha.et',
            'phone' => '+251911223344',
            'pin' => Hash::make('1234'),
            'password' => Hash::make('password'),
            'structure_type' => 'EXECUTIVE',
            'grade_level' => 5,
            'primary_role' => 'CEO',
        ]);

        // 2. Administrative Structure (Articles 3C, 13, 14, 15: Parallel Units)
        $infoOfficer = User::create([
            'official_id' => 'BH-INF-001',
            'name' => 'Kalkidan Assefa (Info Dept)',
            'email' => 'info@beha.et',
            'phone' => '+251922334455',
            'pin' => Hash::make('1234'),
            'password' => Hash::make('password'),
            'structure_type' => 'ADMINISTRATIVE',
            'admin_department' => 'INFORMATION',
            'grade_level' => 4,
            'primary_role' => 'INFORMATION_OFFICER',
        ]);

        $financeOfficer = User::create([
            'official_id' => 'BH-FIN-001',
            'name' => 'Henok Tesfaye (Finance Dept)',
            'email' => 'finance@beha.et',
            'phone' => '+251933445566',
            'pin' => Hash::make('1234'),
            'password' => Hash::make('password'),
            'structure_type' => 'ADMINISTRATIVE',
            'admin_department' => 'FINANCE',
            'grade_level' => 4,
            'primary_role' => 'FINANCE_OFFICER',
        ]);

        $sysAdmin = User::create([
            'official_id' => 'BH-SYS-001',
            'name' => 'Robel Girma (SysAdmin)',
            'email' => 'admin@beha.et',
            'phone' => '+251944556677',
            'pin' => Hash::make('1234'),
            'password' => Hash::make('password'),
            'structure_type' => 'ADMINISTRATIVE',
            'admin_department' => 'SYSTEM_ADMIN',
            'grade_level' => 4,
            'primary_role' => 'SYSTEM_ADMIN',
        ]);

        // 3. Sales Structure - Generation (Article 10, 16)
        $generation = Generation::create([
            'name' => 'Generation Alpha',
            'code' => 'GEN-01',
        ]);

        $genHead = User::create([
            'official_id' => 'BH-GEN-001',
            'name' => 'Alemayehu Tadesse (Gen Head)',
            'email' => 'genhead@beha.et',
            'phone' => '+251955667788',
            'pin' => Hash::make('1234'),
            'password' => Hash::make('password'),
            'structure_type' => 'SALES',
            'generation_id' => $generation->id,
            'grade_level' => 5, // Art. 16.2: At least Level 5
            'primary_role' => 'GENERATION_HEAD',
            'is_generation_head' => true,
            'is_branch_manager' => true, // Art. 16.1: Simultaneously Branch Mgr & Team Leader
            'is_team_leader' => true,
        ]);
        $generation->update(['generation_head_id' => $genHead->id]);

        // 4. Sales Structure - Branch (Article 9, 17)
        $branch = Branch::create([
            'generation_id' => $generation->id,
            'name' => 'Ayat Main Branch',
            'code' => 'BR-01-AYAT',
            'city' => 'Addis Ababa',
            'address' => 'Ayat Square, Beha Plaza 3rd Floor',
        ]);

        $branchMgr = User::create([
            'official_id' => 'BH-BR-001',
            'name' => 'Selamawit Bekele (Branch Mgr)',
            'email' => 'branchmgr@beha.et',
            'phone' => '+251966778899',
            'pin' => Hash::make('1234'),
            'password' => Hash::make('password'),
            'structure_type' => 'SALES',
            'generation_id' => $generation->id,
            'branch_id' => $branch->id,
            'grade_level' => 4, // Art. 17.2: At least Level 4
            'primary_role' => 'BRANCH_MANAGER',
            'is_branch_manager' => true,
            'is_team_leader' => true, // Art. 17.1: Simultaneously Team Leader
        ]);
        $branch->update(['branch_manager_id' => $branchMgr->id]);

        // 5. Sales Structure - Team (Article 8, 18)
        $team = Team::create([
            'branch_id' => $branch->id,
            'name' => 'Alpha Sales Squad 1',
            'code' => 'TM-01-01',
        ]);

        $teamLeader = User::create([
            'official_id' => 'BH-TL-001',
            'name' => 'Yonas Haile (Team Leader)',
            'email' => 'teamleader@beha.et',
            'phone' => '+251977889900',
            'pin' => Hash::make('1234'),
            'password' => Hash::make('password'),
            'structure_type' => 'SALES',
            'generation_id' => $generation->id,
            'branch_id' => $branch->id,
            'team_id' => $team->id,
            'grade_level' => 3, // Art. 18.1: At least Level 3
            'primary_role' => 'TEAM_LEADER',
            'is_team_leader' => true,
        ]);
        $team->update(['team_leader_id' => $teamLeader->id]);

        // 6. Ground Team Members (Article 19: Level 1 and 2)
        $agent1 = User::create([
            'official_id' => 'BH-AGT-001',
            'name' => 'Tewodros Kassahun (Agent)',
            'email' => 'agent1@beha.et',
            'phone' => '+251911001122',
            'pin' => Hash::make('1234'),
            'password' => Hash::make('password'),
            'structure_type' => 'SALES',
            'generation_id' => $generation->id,
            'branch_id' => $branch->id,
            'team_id' => $team->id,
            'grade_level' => 2, // Art. 19.1: Level 2
            'primary_role' => 'TEAM_MEMBER',
        ]);

        $agent2 = User::create([
            'official_id' => 'BH-AGT-002',
            'name' => 'Marta Solomon (Agent)',
            'email' => 'agent2@beha.et',
            'phone' => '+251911334455',
            'pin' => Hash::make('1234'),
            'password' => Hash::make('password'),
            'structure_type' => 'SALES',
            'generation_id' => $generation->id,
            'branch_id' => $branch->id,
            'team_id' => $team->id,
            'grade_level' => 1, // Art. 19.1: Level 1
            'primary_role' => 'TEAM_MEMBER',
        ]);

        // 7. Developer Contract & Properties (Articles 12.4, 13.2, 16.6)
        $contract = DeveloperContract::create([
            'developer_name' => 'Flintstone Homes PLC',
            'contract_ref' => 'FLINT-2026-01',
            'agreed_commission_rate' => 2.50,
            'start_date' => '2026-01-01',
            'expiry_date' => '2027-01-01',
            'ceo_signed' => true, // Art. 12.4
            'terms_summary' => 'Exclusive marketing agency agreement for Ayat G+2 Luxury Villas.',
        ]);

        $prop1 = Property::create([
            'developer_contract_id' => $contract->id,
            'property_code' => 'BH-AYAT-V01',
            'title' => 'Ayat G+2 Luxury Modern Villa',
            'property_type' => 'villa',
            'price' => 18500000.00,
            'advance_payment' => 3700000.00,
            'area_sqm' => 250.00,
            'bedrooms' => 4,
            'bathrooms' => 3,
            'subcity' => 'Yeka',
            'specific_area' => 'Ayat Zone 3 near Hillside',
            'description' => 'Brand new G+2 villa with modern kitchen, garden, and parking for 3 cars.',
            'images' => ['/images/properties/ayat1.jpg'],
            'intake_by_gen_head_id' => $genHead->id,    // Art. 16.6
            'verified_by_info_dept_id' => $infoOfficer->id, // Art. 13.2
            'is_published' => true,
            'published_at' => now(),
            'status' => 'published',
        ]);

        $prop2 = Property::create([
            'developer_contract_id' => $contract->id,
            'property_code' => 'BH-BOLE-A01',
            'title' => 'Bole Atlas 2-Bedroom Prime Apartment',
            'property_type' => 'apartment',
            'price' => 12800000.00,
            'advance_payment' => 2560000.00,
            'area_sqm' => 115.00,
            'bedrooms' => 2,
            'bathrooms' => 2,
            'subcity' => 'Bole',
            'specific_area' => 'Atlas Behind Edna Mall',
            'description' => 'Fully finished with elevator, backup generator, and panoramic balcony view.',
            'images' => ['/images/properties/bole1.jpg'],
            'intake_by_gen_head_id' => $genHead->id,
            'verified_by_info_dept_id' => $infoOfficer->id,
            'is_published' => true,
            'published_at' => now(),
            'status' => 'published',
        ]);

        // 8. Customer Registration (Article 8.3, 19.1)
        $customer = Customer::create([
            'full_name' => 'Ato Abebe Demissie',
            'phone' => '+251911998877',
            'email' => 'abebe@example.com',
            'budget_min' => 15000000.00,
            'budget_max' => 20000000.00,
            'preferred_property_type' => 'villa',
            'preferred_locations' => ['Yeka', 'Bole'],
            'client_inclination' => 'Prefers villas with parking and immediate title deed transfer.',
            'registered_by_id' => $agent1->id, // Registered by Member
            'team_id' => $team->id,
            'branch_id' => $branch->id,
            'status' => 'visited_site',
        ]);

        // 9. Daily Activity Diary (Article 8.4, 19.2)
        DailyDiary::create([
            'report_date' => now()->toDateString(),
            'member_id' => $agent1->id,
            'team_id' => $team->id,
            'calls_made' => 12,
            'customers_registered' => 1,
            'field_visits_conducted' => 1,
            'activity_summary' => 'Conducted physical field visit to Ayat Luxury Villa with Ato Abebe Demissie.',
            'challenges_encountered' => 'Customer requested bank financing options for 40% balance.',
            'reviewed_by_leader_id' => $teamLeader->id,
            'leader_notes' => 'Good prospect. Will follow up during morning team meeting tomorrow.',
            'status' => 'reviewed',
        ]);

        // 10. Branch Customer Tendency Report (Article 9.5, 17.6)
        TendencyReport::create([
            'branch_id' => $branch->id,
            'branch_manager_id' => $branchMgr->id,
            'period_start' => now()->subDays(14)->toDateString(),
            'period_end' => now()->toDateString(),
            'demanded_property_types' => ['villa', 'apartment'],
            'average_budget' => 16000000.00,
            'market_tendency_summary' => 'Strong demand for finished G+2 villas in Ayat. Apartment inquiries centering on Bole Atlas.',
            'customer_objections_analysis' => 'Primary friction is payment schedule duration. Developers offering 3-year installments see 80% higher conversion.',
            'status' => 'submitted_to_gen_head',
            'submitted_at' => now(),
        ]);

        // 11. Deals & Payment Certificates (Article 22: Salary and Commission Distribution)
        // Deal 1: Direct Agent (Tewodros Kassahun, Level 2) sells apartment
        \App\Services\CommissionService::createDealAndCertificate([
            'property_id' => $prop2->id,
            'customer_id' => $customer->id,
            'agent_id' => $agent1->id,
            'sale_price' => 12800000.00,
            'bank_reference' => 'CBE-DEP-8842109',
        ], $financeOfficer);

        // Deal 2: Article 22.4 Example - Branch Manager (Selamawit Bekele) directly sells a villa
        // Earnings: 1.5% (seller) + 0.25% (team leader) + 0.15% (branch mgr) = 1.90% total!
        \App\Services\CommissionService::createDealAndCertificate([
            'property_id' => $prop1->id,
            'customer_id' => $customer->id,
            'agent_id' => $branchMgr->id,
            'sale_price' => 25000000.00,
            'bank_reference' => 'CBE-DEP-9930214',
        ], $financeOfficer);

        // 12. Support Records for 8 Role-Based Dashboards
        // 12.1 Audit Logs (System Admin & CEO oversight)
        AuditLog::create([
            'user_id' => $sysAdmin->id,
            'action' => 'SYSTEM_CONFIGURATION_CHECK',
            'entity_type' => 'DATABASE',
            'entity_id' => 1,
            'ip_address' => '127.0.0.1',
            'details' => 'Performed automated integrity audit on Article 22 commission disbursement constraints.',
        ]);
        AuditLog::create([
            'user_id' => $ceo->id,
            'action' => 'EXECUTIVE_DIRECTIVE_ISSUED',
            'entity_type' => 'POLICY',
            'entity_id' => 1,
            'ip_address' => '192.168.1.10',
            'details' => 'Issued directive on strict adherence to Ethiopian Tax Proclamation 2% withholding on brokerage payouts.',
        ]);

        // 12.2 Access Requests (SysAdmin / CEO)
        AccessRequest::create([
            'user_id' => $agent1->id,
            'requested_role' => 'TEAM_LEADER',
            'justification' => 'Completed 6 successful property transactions and met Article 18 Level 3 qualification criteria.',
            'status' => 'pending',
        ]);

        // 12.3 Discussion Meetings & Assemblies
        DiscussionMeeting::create([
            'title' => 'Assembly of Generation Heads - Q3 Strategic Planning',
            'meeting_type' => 'in_person',
            'tier_scope' => 'CEO_ASSEMBLY',
            'organizer_id' => $ceo->id,
            'scheduled_at' => now()->addDays(3)->setTime(10, 0),
            'location_or_link' => 'Beha HQ Executive Boardroom / Hybrid Zoom',
            'agenda' => '1. Review Q3 sales volume vs targets. 2. Developer partnership pipeline for Sarbet project. 3. Promotion of Level 2 agents.',
            'decision_log' => 'Pending meeting execution.',
            'status' => 'scheduled',
        ]);
        DiscussionMeeting::create([
            'title' => 'Ayat Branch Bi-Weekly Performance & Pipeline Review',
            'meeting_type' => 'in_person',
            'tier_scope' => 'BRANCH',
            'organizer_id' => $branchMgr->id,
            'scheduled_at' => now()->addDays(1)->setTime(14, 0),
            'location_or_link' => 'Ayat Branch Conference Room',
            'agenda' => 'Site visit scheduling for pending prospects and Tendency Report alignment.',
            'status' => 'scheduled',
        ]);
        DiscussionMeeting::create([
            'title' => 'Eagle Team Daily Morning Standup',
            'meeting_type' => 'call',
            'tier_scope' => 'TEAM',
            'organizer_id' => $teamLeader->id,
            'scheduled_at' => now()->setTime(8, 30),
            'location_or_link' => 'Internal Team Call',
            'agenda' => 'Reviewing daily call targets and Ato Abebe villa followup.',
            'status' => 'completed',
            'decision_log' => 'Agent Tewodros to follow up with customer by 11:00 AM regarding bank pre-approval.',
        ]);

        // 12.4 Disputes & Grievances (Gen Head & Branch Mgr)
        Dispute::create([
            'dispute_code' => 'DSP-2026-001',
            'raised_by_id' => $agent2->id,
            'branch_id' => $branch->id,
            'title' => 'Lead Attribution Conflict for Ayat Villa Prospect',
            'category' => 'customer_jurisdiction',
            'description' => 'Two agents had overlapping customer intake for the same prospective buyer from diaspora expo.',
            'status' => 'under_review',
        ]);

        // 12.5 System Upgrade Proposals (SysAdmin -> CEO)
        SystemUpgrade::create([
            'title' => 'Beha Mobile Portal v2.4 - Offline Diary Sync & SMS Lead Alerts',
            'version' => '2.4.0',
            'study_notes' => 'Field agents in areas with weak cellular data can draft daily diaries offline. Auto-synced on reconnect.',
            'impact_assessment' => 'Zero database downtime required. Enhances field productivity by estimated 35%.',
            'status' => 'submitted_to_ceo',
            'submitted_by_id' => $sysAdmin->id,
        ]);

        // 12.6 In-App Role Notifications
        AppNotification::create([
            'user_id' => $ceo->id,
            'target_role' => 'CEO',
            'title' => 'New Payment Certificate Awaiting Signature',
            'message' => 'Payment Certificate for BH-DEAL-0002 (ETB 25,000,000 villa) requires CEO digital approval.',
            'type' => 'alert',
            'is_read' => false,
            'action_link' => '/operations',
        ]);
        AppNotification::create([
            'user_id' => $financeOfficer->id,
            'target_role' => 'FINANCE_OFFICER',
            'title' => 'Tax Withholding Reconciliation Due',
            'message' => 'Commission disbursements for Q3 require statutory 2% withholding tax transfer to MoR.',
            'type' => 'info',
            'is_read' => false,
            'action_link' => '/operations',
        ]);
        AppNotification::create([
            'user_id' => $genHead->id,
            'target_role' => 'GENERATION_HEAD',
            'title' => 'New Developer Contract Intake Ready',
            'message' => 'Taye Real Estate developer contract ready for generation-level inspection.',
            'type' => 'info',
            'is_read' => false,
        ]);
    }
}
