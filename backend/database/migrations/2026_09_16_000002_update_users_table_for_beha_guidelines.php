<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('official_id', 30)->nullable()->unique()->after('id');
            $table->string('phone', 30)->nullable()->after('email');
            $table->string('pin', 255)->nullable()->after('password'); // Art. 15.2 (PIN resets)
            
            // Structural placement (Articles 3C, 4, 5)
            $table->enum('structure_type', ['EXECUTIVE', 'ADMINISTRATIVE', 'SALES'])->default('SALES')->after('phone');
            $table->enum('admin_department', ['INFORMATION', 'FINANCE', 'SYSTEM_ADMIN'])->nullable()->after('structure_type');
            
            // Organizational associations
            $table->foreignId('generation_id')->nullable()->constrained('generations')->nullOnDelete()->after('admin_department');
            $table->foreignId('branch_id')->nullable()->constrained('branches')->nullOnDelete()->after('generation_id');
            $table->foreignId('team_id')->nullable()->constrained('teams')->nullOnDelete()->after('branch_id');
            
            // Performance Grade (Articles 16.2, 17.2, 18.1, 19.1)
            $table->unsignedTinyInteger('grade_level')->default(1)->after('team_id')
                ->comment('1=Member L1, 2=Member L2, 3=Team Leader, 4=Branch Mgr, 5=Gen Head');
            
            // Role & Dual-Hat Capabilities (Articles 16.1, 17.1)
            $table->string('primary_role', 50)->default('TEAM_MEMBER')->after('grade_level');
            $table->boolean('is_team_leader')->default(false)->after('primary_role');
            $table->boolean('is_branch_manager')->default(false)->after('is_team_leader');
            $table->boolean('is_generation_head')->default(false)->after('is_branch_manager');
            
            $table->enum('status', ['active', 'suspended', 'inactive'])->default('active')->after('is_generation_head');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['generation_id']);
            $table->dropForeign(['branch_id']);
            $table->dropForeign(['team_id']);
            $table->dropColumn([
                'official_id',
                'phone',
                'pin',
                'structure_type',
                'admin_department',
                'generation_id',
                'branch_id',
                'team_id',
                'grade_level',
                'primary_role',
                'is_team_leader',
                'is_branch_manager',
                'is_generation_head',
                'status',
            ]);
        });
    }
};
