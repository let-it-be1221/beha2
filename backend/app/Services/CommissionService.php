<?php

namespace App\Services;

use App\Models\User;
use App\Models\Branch;
use App\Models\Team;
use App\Models\Generation;
use App\Models\Property;
use App\Models\Customer;
use App\Models\SalesDeal;
use App\Models\PaymentCertificate;
use App\Models\CommissionDisbursement;

class CommissionService
{
    /**
     * Calculate Article 22 commission tier distribution
     *
     * Tiers:
     * 1st / Direct Sales Employee (Level 1 and 2) = 1.5%
     * 2nd / Team Leader (Level 3) = 0.25%
     * 3rd / Branch Manager (Level 4) = 0.15%
     * 4th / Generation Head (Level 5) = 0.10%
     *
     * Leadership Cumulative Rule (Article 22.4):
     * Leaders who directly execute a sale get their own salesperson percentage (1.5%)
     * added to their leadership percentage.
     * e.g., Branch Manager: 1.5% + 0.25% (TL) + 0.15% (BM) = 1.90%
     */
    public static function calculateTiers(float $salePrice, User $agent): array
    {
        $taxRate = 0.02; // 2% withholding tax under Article 14.5
        
        // Find leadership hierarchy for this agent
        $team = $agent->team_id ? Team::with('leader')->find($agent->team_id) : Team::first();
        $branch = $agent->branch_id ? Branch::with('manager')->find($agent->branch_id) : Branch::first();
        $generation = $agent->generation_id ? Generation::with('head')->find($agent->generation_id) : Generation::first();

        $teamLeader = $team ? $team->leader : null;
        $branchMgr = $branch ? $branch->manager : null;
        $genHead = $generation ? $generation->head : null;

        $tiers = [];
        $totalCommissionRate = 0.0;

        if ($agent->is_generation_head) {
            // Generation Head personally sells (Article 22.4):
            // 1.5% (salesperson) + 0.25% (team leader) + 0.15% (branch mgr) + 0.1% (gen head) = 2.0%
            $rate = 2.00;
            $tiers[] = [
                'beneficiary_id' => $agent->id,
                'beneficiary_name' => $agent->name,
                'beneficiary_role' => 'GENERATION_HEAD (Direct Seller)',
                'rate_breakdown' => '1.5% (Seller) + 0.25% (TL) + 0.15% (BM) + 0.1% (GH)',
                'percentage' => $rate,
            ];
            $totalCommissionRate = $rate;
        } elseif ($agent->is_branch_manager) {
            // Branch Manager personally sells (Article 22.4 example):
            // 1.5% (salesperson) + 0.25% (team leader) + 0.15% (branch mgr) = 1.90%
            $rate = 1.90;
            $tiers[] = [
                'beneficiary_id' => $agent->id,
                'beneficiary_name' => $agent->name,
                'beneficiary_role' => 'BRANCH_MANAGER (Direct Seller)',
                'rate_breakdown' => '1.5% (Seller) + 0.25% (TL) + 0.15% (BM)',
                'percentage' => $rate,
            ];
            $totalCommissionRate += $rate;

            // Generation Head tier: 0.1%
            if ($genHead && $genHead->id !== $agent->id) {
                $tiers[] = [
                    'beneficiary_id' => $genHead->id,
                    'beneficiary_name' => $genHead->name,
                    'beneficiary_role' => 'GENERATION_HEAD',
                    'rate_breakdown' => '0.10% (Level 5 Tier)',
                    'percentage' => 0.10,
                ];
                $totalCommissionRate += 0.10;
            }
        } elseif ($agent->is_team_leader) {
            // Team Leader personally sells (Article 22.4):
            // 1.5% (salesperson) + 0.25% (team leader) = 1.75%
            $rate = 1.75;
            $tiers[] = [
                'beneficiary_id' => $agent->id,
                'beneficiary_name' => $agent->name,
                'beneficiary_role' => 'TEAM_LEADER (Direct Seller)',
                'rate_breakdown' => '1.5% (Seller) + 0.25% (TL)',
                'percentage' => $rate,
            ];
            $totalCommissionRate += $rate;

            // Branch Manager tier: 0.15%
            if ($branchMgr && $branchMgr->id !== $agent->id) {
                $tiers[] = [
                    'beneficiary_id' => $branchMgr->id,
                    'beneficiary_name' => $branchMgr->name,
                    'beneficiary_role' => 'BRANCH_MANAGER',
                    'rate_breakdown' => '0.15% (Level 4 Tier)',
                    'percentage' => 0.15,
                ];
                $totalCommissionRate += 0.15;
            }

            // Generation Head tier: 0.1%
            if ($genHead && $genHead->id !== $agent->id) {
                $tiers[] = [
                    'beneficiary_id' => $genHead->id,
                    'beneficiary_name' => $genHead->name,
                    'beneficiary_role' => 'GENERATION_HEAD',
                    'rate_breakdown' => '0.10% (Level 5 Tier)',
                    'percentage' => 0.10,
                ];
                $totalCommissionRate += 0.10;
            }
        } else {
            // Standard Ground Consultant (Level 1 or Level 2) sells (Article 22.3):
            // 1st / Direct Sales Employee = 1.5%
            $tiers[] = [
                'beneficiary_id' => $agent->id,
                'beneficiary_name' => $agent->name,
                'beneficiary_role' => 'DIRECT_SALES_AGENT',
                'rate_breakdown' => '1.50% (Direct Sales Employee Tier)',
                'percentage' => 1.50,
            ];
            $totalCommissionRate += 1.50;

            // 2nd / Team Leader = 0.25%
            if ($teamLeader) {
                $tiers[] = [
                    'beneficiary_id' => $teamLeader->id,
                    'beneficiary_name' => $teamLeader->name,
                    'beneficiary_role' => 'TEAM_LEADER',
                    'rate_breakdown' => '0.25% (Team Leader Tier)',
                    'percentage' => 0.25,
                ];
                $totalCommissionRate += 0.25;
            }

            // 3rd / Branch Manager = 0.15%
            if ($branchMgr) {
                $tiers[] = [
                    'beneficiary_id' => $branchMgr->id,
                    'beneficiary_name' => $branchMgr->name,
                    'beneficiary_role' => 'BRANCH_MANAGER',
                    'rate_breakdown' => '0.15% (Branch Manager Tier)',
                    'percentage' => 0.15,
                ];
                $totalCommissionRate += 0.15;
            }

            // 4th / Generation Head = 0.10%
            if ($genHead) {
                $tiers[] = [
                    'beneficiary_id' => $genHead->id,
                    'beneficiary_name' => $genHead->name,
                    'beneficiary_role' => 'GENERATION_HEAD',
                    'rate_breakdown' => '0.10% (Generation Head Tier)',
                    'percentage' => 0.10,
                ];
                $totalCommissionRate += 0.10;
            }
        }

        // Calculate monetary values for each tier
        $calculatedTiers = [];
        $totalGross = 0.0;
        $totalTax = 0.0;
        $totalNet = 0.0;

        foreach ($tiers as $tier) {
            $gross = round(($salePrice * ($tier['percentage'] / 100)), 2);
            $tax = round(($gross * $taxRate), 2);
            $net = round(($gross - $tax), 2);

            $calculatedTiers[] = array_merge($tier, [
                'gross_amount' => $gross,
                'tax_amount' => $tax,
                'net_amount' => $net,
            ]);

            $totalGross += $gross;
            $totalTax += $tax;
            $totalNet += $net;
        }

        return [
            'guideline_reference' => 'Article 22: Salary and Commission Distribution',
            'sale_price' => $salePrice,
            'selling_agent' => [
                'id' => $agent->id,
                'name' => $agent->name,
                'official_id' => $agent->official_id,
                'grade_level' => $agent->grade_level,
                'primary_role' => $agent->primary_role,
            ],
            'total_commission_percentage' => round($totalCommissionRate, 2),
            'total_gross_commission' => round($totalGross, 2),
            'total_tax_withheld' => round($totalTax, 2),
            'total_net_disbursed' => round($totalNet, 2),
            'disbursements' => $calculatedTiers,
        ];
    }

    /**
     * Process a closed sales deal and generate Article 22 payment certificate & disbursements
     */
    public static function createDealAndCertificate(array $dealData, User $preparedByFinance): array
    {
        $agent = User::findOrFail($dealData['agent_id']);
        $property = Property::findOrFail($dealData['property_id']);
        $customer = Customer::findOrFail($dealData['customer_id']);
        $salePrice = (float) $dealData['sale_price'];

        $calc = self::calculateTiers($salePrice, $agent);

        $teamId = $agent->team_id ?? Team::first()->id;
        $branchId = $agent->branch_id ?? Branch::first()->id;
        $generationId = $agent->generation_id ?? Generation::first()->id;

        $dealCount = SalesDeal::count() + 1;
        $dealCode = 'DEAL-' . date('Y') . '-' . str_pad($dealCount, 4, '0', STR_PAD_LEFT);

        $deal = SalesDeal::create([
            'deal_code' => $dealCode,
            'property_id' => $property->id,
            'customer_id' => $customer->id,
            'agent_id' => $agent->id,
            'team_id' => $teamId,
            'branch_id' => $branchId,
            'generation_id' => $generationId,
            'sale_price' => $salePrice,
            'gross_commission' => $calc['total_gross_commission'],
            'bank_reference' => $dealData['bank_reference'] ?? ('CBE-DEP-' . rand(1000000, 9999999)),
            'deal_status' => 'verified_by_finance',
        ]);

        $certNo = 'PC-' . date('Y') . '-' . str_pad($dealCount, 4, '0', STR_PAD_LEFT);
        $cert = PaymentCertificate::create([
            'certificate_no' => $certNo,
            'deal_id' => $deal->id,
            'prepared_by_finance_id' => $preparedByFinance->id,
            'gross_amount' => $calc['total_gross_commission'],
            'tax_withheld' => $calc['total_tax_withheld'],
            'net_disbursed' => $calc['total_net_disbursed'],
            'ceo_approved' => false,
            'payment_status' => 'pending_ceo_approval',
        ]);

        foreach ($calc['disbursements'] as $disbursement) {
            CommissionDisbursement::create([
                'payment_certificate_id' => $cert->id,
                'beneficiary_id' => $disbursement['beneficiary_id'],
                'beneficiary_role' => $disbursement['beneficiary_role'],
                'split_percentage' => $disbursement['percentage'],
                'net_amount' => $disbursement['net_amount'],
                'tax_amount' => $disbursement['tax_amount'],
            ]);
        }

        // Mark property as sold
        $property->update(['status' => 'sold']);

        return [
            'deal' => $deal,
            'certificate' => $cert->load(['disbursements.beneficiary', 'deal.property', 'deal.customer']),
            'calculation' => $calc,
        ];
    }
}
