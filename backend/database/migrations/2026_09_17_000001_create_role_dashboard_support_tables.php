<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Audit Logs (System Admin, CEO oversight)
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('action', 100);
            $table->string('entity_type', 100)->nullable();
            $table->unsignedBigInteger('entity_id')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->text('details')->nullable();
            $table->timestamps();
        });

        // 2. Access Requests (System Admin / CEO approval)
        Schema::create('access_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('requested_role', 50);
            $table->text('justification');
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->foreignId('reviewed_by_id')->nullable()->constrained('users')->nullOnDelete();
            $table->text('review_notes')->nullable();
            $table->timestamps();
        });

        // 3. Discussion Meetings & Assemblies (CEO Gen Head Assembly, Branch/Team meetings)
        Schema::create('discussion_meetings', function (Blueprint $table) {
            $table->id();
            $table->string('title', 200);
            $table->enum('meeting_type', ['call', 'virtual', 'in_person'])->default('virtual');
            $table->string('tier_scope', 50)->default('BRANCH'); // CEO_ASSEMBLY, GENERATION, BRANCH, TEAM
            $table->foreignId('organizer_id')->constrained('users')->onDelete('cascade');
            $table->dateTime('scheduled_at');
            $table->string('location_or_link', 255)->nullable();
            $table->text('agenda')->nullable();
            $table->text('decision_log')->nullable();
            $table->enum('status', ['scheduled', 'in_progress', 'completed', 'cancelled'])->default('scheduled');
            $table->timestamps();
        });

        // 4. Disputes & Grievances (Gen Head, Branch Manager)
        Schema::create('disputes', function (Blueprint $table) {
            $table->id();
            $table->string('dispute_code', 30)->unique();
            $table->foreignId('raised_by_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('branch_id')->nullable()->constrained('branches')->nullOnDelete();
            $table->string('title', 200);
            $table->enum('category', ['operational', 'conflict_of_interest', 'commission_split', 'customer_jurisdiction'])->default('operational');
            $table->text('description');
            $table->enum('status', ['open', 'under_review', 'resolved'])->default('open');
            $table->foreignId('resolved_by_id')->nullable()->constrained('users')->nullOnDelete();
            $table->text('resolution_notes')->nullable();
            $table->timestamp('resolved_at')->nullable();
            $table->timestamps();
        });

        // 5. System Upgrade Pipeline (System Admin study -> submit to CEO -> deploy)
        Schema::create('system_upgrades', function (Blueprint $table) {
            $table->id();
            $table->string('title', 200);
            $table->string('version', 30);
            $table->text('study_notes');
            $table->text('impact_assessment')->nullable();
            $table->enum('status', ['study', 'submitted_to_ceo', 'approved_by_ceo', 'deployed'])->default('study');
            $table->foreignId('submitted_by_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('ceo_approved_by_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('deployed_at')->nullable();
            $table->timestamps();
        });

        // 6. In-App Notifications
        Schema::create('app_notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->cascadeOnDelete();
            $table->string('target_role', 50)->nullable(); // e.g. CEO, BRANCH_MANAGER
            $table->string('title', 150);
            $table->text('message');
            $table->string('type', 50)->default('info'); // info, success, warning, alert
            $table->boolean('is_read')->default(false);
            $table->string('action_link', 255)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('app_notifications');
        Schema::dropIfExists('system_upgrades');
        Schema::dropIfExists('disputes');
        Schema::dropIfExists('discussion_meetings');
        Schema::dropIfExists('access_requests');
        Schema::dropIfExists('audit_logs');
    }
};
