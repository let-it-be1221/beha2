<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Developer Agreements (Article 12.4 - CEO signs strategic contracts)
        Schema::create('developer_contracts', function (Blueprint $table) {
            $table->id();
            $table->string('developer_name', 150);
            $table->string('contract_ref', 50)->unique();
            $table->decimal('agreed_commission_rate', 5, 2); // e.g. 2.00%
            $table->date('start_date');
            $table->date('expiry_date');
            $table->boolean('ceo_signed')->default(true); // Signed per Article 12.4
            $table->text('terms_summary')->nullable();
            $table->timestamps();
        });

        // 2. Properties (Article 13.2 - Info Dept organizes & presents, Article 16.6 - Gen Head intake)
        Schema::create('properties', function (Blueprint $table) {
            $table->id();
            $table->foreignId('developer_contract_id')->constrained('developer_contracts')->onDelete('cascade');
            $table->string('property_code', 30)->unique();
            $table->string('title', 200);
            $table->enum('property_type', ['villa', 'apartment', 'commercial', 'land', 'condominium']);
            $table->decimal('price', 15, 2);
            $table->decimal('advance_payment', 15, 2)->nullable();
            $table->decimal('area_sqm', 10, 2);
            $table->unsignedTinyInteger('bedrooms')->nullable();
            $table->unsignedTinyInteger('bathrooms')->nullable();
            $table->string('subcity', 100);
            $table->string('specific_area', 200)->nullable();
            $table->text('description')->nullable();
            $table->json('images')->nullable();
            
            // Workflow Ingestion & Verification (Article 16.6 & 13.2)
            $table->foreignId('intake_by_gen_head_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('verified_by_info_dept_id')->nullable()->constrained('users')->nullOnDelete();
            $table->boolean('is_published')->default(false);
            $table->timestamp('published_at')->nullable();
            $table->enum('status', ['intake', 'verified_by_info', 'published', 'reserved', 'sold'])->default('intake');
            $table->timestamps();
        });

        // 3. Sales Deals (Article 19.4 - Executing property sales)
        Schema::create('sales_deals', function (Blueprint $table) {
            $table->id();
            $table->string('deal_code', 30)->unique();
            $table->foreignId('property_id')->constrained('properties')->onDelete('cascade');
            $table->foreignId('customer_id')->constrained('customers')->onDelete('cascade');
            $table->foreignId('agent_id')->constrained('users')->onDelete('cascade'); // Direct seller
            $table->foreignId('team_id')->constrained('teams')->onDelete('cascade');
            $table->foreignId('branch_id')->constrained('branches')->onDelete('cascade');
            $table->foreignId('generation_id')->constrained('generations')->onDelete('cascade');
            
            $table->decimal('sale_price', 15, 2);
            $table->decimal('gross_commission', 15, 2);
            $table->string('bank_reference', 100)->nullable(); // Developer deposit reference
            $table->enum('deal_status', ['submitted', 'verified_by_finance', 'completed', 'cancelled'])->default('submitted');
            $table->timestamps();
        });

        // 4. Payment Certificates (Article 12.3 & 14.2 - Prepared by Finance, approved by CEO)
        Schema::create('payment_certificates', function (Blueprint $table) {
            $table->id();
            $table->string('certificate_no', 50)->unique();
            $table->foreignId('deal_id')->constrained('sales_deals')->onDelete('cascade');
            $table->foreignId('prepared_by_finance_id')->constrained('users')->onDelete('cascade'); // Art. 14.2
            
            $table->decimal('gross_amount', 15, 2);
            $table->decimal('tax_withheld', 15, 2); // Article 14.5 (Country's tax law framework)
            $table->decimal('net_disbursed', 15, 2);
            
            // CEO Sole Signatory Approval (Article 12.2, 12.3)
            $table->boolean('ceo_approved')->default(false);
            $table->timestamp('ceo_approved_at')->nullable();
            $table->foreignId('ceo_id')->nullable()->constrained('users')->nullOnDelete();
            
            $table->enum('payment_status', ['pending_ceo_approval', 'approved_by_ceo', 'disbursed'])->default('pending_ceo_approval');
            $table->timestamp('disbursed_at')->nullable();
            $table->timestamps();
        });

        // 5. Commission Disbursements per sales tier (Article 14.2)
        Schema::create('commission_disbursements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('payment_certificate_id')->constrained('payment_certificates')->onDelete('cascade');
            $table->foreignId('beneficiary_id')->constrained('users')->onDelete('cascade');
            $table->string('beneficiary_role', 50); // AGENT, TEAM_LEADER, BRANCH_MGR, GEN_HEAD, COMPANY
            $table->decimal('split_percentage', 5, 2);
            $table->decimal('net_amount', 15, 2);
            $table->decimal('tax_amount', 15, 2);
            $table->boolean('is_paid')->default(false);
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('commission_disbursements');
        Schema::dropIfExists('payment_certificates');
        Schema::dropIfExists('sales_deals');
        Schema::dropIfExists('properties');
        Schema::dropIfExists('developer_contracts');
    }
};
