<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Customer Registration (Article 8.3, 19.1)
        Schema::create('customers', function (Blueprint $table) {
            $table->id();
            $table->string('full_name', 150);
            $table->string('phone', 30);
            $table->string('alternate_phone', 30)->nullable();
            $table->string('email', 100)->nullable();
            $table->decimal('budget_min', 15, 2)->nullable();
            $table->decimal('budget_max', 15, 2)->nullable();
            $table->enum('preferred_property_type', ['villa', 'apartment', 'commercial', 'land', 'condominium'])->default('apartment');
            $table->json('preferred_locations')->nullable();
            $table->text('client_inclination')->nullable(); // Article 10.5 (preferences & inclinations)
            
            // Sales organization origin
            $table->foreignId('registered_by_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('team_id')->constrained('teams')->onDelete('cascade');
            $table->foreignId('branch_id')->constrained('branches')->onDelete('cascade');
            
            $table->enum('status', ['active_lead', 'visited_site', 'negotiating', 'closed_deal', 'inactive'])->default('active_lead');
            $table->timestamps();
        });

        // 2. Team Member Daily Activity Report / Diary (Article 8.4, 19.2)
        Schema::create('daily_diaries', function (Blueprint $table) {
            $table->id();
            $table->date('report_date');
            $table->foreignId('member_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('team_id')->constrained('teams')->onDelete('cascade');
            $table->unsignedInteger('calls_made')->default(0);
            $table->unsignedInteger('customers_registered')->default(0);
            $table->unsignedInteger('field_visits_conducted')->default(0);
            $table->text('activity_summary');
            $table->text('challenges_encountered')->nullable();
            
            // Team Leader Review (Article 8.4 - Daily Meeting review)
            $table->foreignId('reviewed_by_leader_id')->nullable()->constrained('users')->nullOnDelete();
            $table->text('leader_notes')->nullable();
            $table->enum('status', ['submitted', 'reviewed'])->default('submitted');
            $table->timestamps();
        });

        // 3. Branch Customer Tendency Report (Article 9.5, 17.6)
        Schema::create('tendency_reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('branch_id')->constrained('branches')->onDelete('cascade');
            $table->foreignId('branch_manager_id')->constrained('users')->onDelete('cascade');
            $table->date('period_start');
            $table->date('period_end');
            $table->json('demanded_property_types')->nullable();
            $table->decimal('average_budget', 15, 2)->nullable();
            $table->text('market_tendency_summary');
            $table->text('customer_objections_analysis')->nullable();
            
            $table->enum('status', ['draft', 'submitted_to_gen_head'])->default('draft');
            $table->timestamp('submitted_at')->nullable();
            $table->timestamps();
        });

        // 4. Generation Summary Report for CEO (Article 16.7)
        Schema::create('generation_summary_reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('generation_id')->constrained('generations')->onDelete('cascade');
            $table->foreignId('generation_head_id')->constrained('users')->onDelete('cascade');
            $table->date('period_start');
            $table->date('period_end');
            $table->decimal('total_sales_volume', 15, 2)->default(0);
            $table->unsignedInteger('total_deals_closed')->default(0);
            $table->text('aggregated_tendency_analysis');
            $table->text('operational_highlights')->nullable();
            $table->timestamp('submitted_to_ceo_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('generation_summary_reports');
        Schema::dropIfExists('tendency_reports');
        Schema::dropIfExists('daily_diaries');
        Schema::dropIfExists('customers');
    }
};
