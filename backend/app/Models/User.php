<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'official_id',
        'name',
        'email',
        'phone',
        'pin',
        'password',
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
    ];

    protected $hidden = [
        'password',
        'pin',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'grade_level' => 'integer',
            'is_team_leader' => 'boolean',
            'is_branch_manager' => 'boolean',
            'is_generation_head' => 'boolean',
        ];
    }

    public function generation(): BelongsTo
    {
        return $this->belongsTo(Generation::class);
    }

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    public function customers(): HasMany
    {
        return $this->hasMany(Customer::class, 'registered_by_id');
    }

    public function diaries(): HasMany
    {
        return $this->hasMany(DailyDiary::class, 'member_id');
    }

    public function deals(): HasMany
    {
        return $this->hasMany(SalesDeal::class, 'agent_id');
    }

    // Role checks per Operational Guidelines
    public function isCeo(): bool
    {
        return $this->primary_role === 'CEO' || $this->structure_type === 'EXECUTIVE';
    }

    public function isAdmin(): bool
    {
        return $this->structure_type === 'ADMINISTRATIVE';
    }

    public function isSales(): bool
    {
        return $this->structure_type === 'SALES';
    }
}
