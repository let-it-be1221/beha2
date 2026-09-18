<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Generation Organization (Article 10: 10 Branches = 1,000 Members)
        Schema::create('generations', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);             // e.g. "Generation Alpha"
            $table->string('code', 30)->unique();    // e.g. "GEN-01"
            $table->unsignedBigInteger('generation_head_id')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // 2. Branch Organization (Article 9: 10 Teams = 100 Members)
        Schema::create('branches', function (Blueprint $table) {
            $table->id();
            $table->foreignId('generation_id')->constrained('generations')->onDelete('cascade');
            $table->string('name', 100);             // e.g. "Ayat Main Branch"
            $table->string('code', 30)->unique();    // e.g. "BR-AYAT-01"
            $table->string('city', 50)->default('Addis Ababa');
            $table->text('address')->nullable();
            $table->unsignedBigInteger('branch_manager_id')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // 3. Team Organization (Article 8: 10 Members per Team)
        Schema::create('teams', function (Blueprint $table) {
            $table->id();
            $table->foreignId('branch_id')->constrained('branches')->onDelete('cascade');
            $table->string('name', 100);             // e.g. "Alpha Sales Team 1"
            $table->string('code', 30)->unique();    // e.g. "TM-AYAT-01"
            $table->unsignedBigInteger('team_leader_id')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('teams');
        Schema::dropIfExists('branches');
        Schema::dropIfExists('generations');
    }
};
