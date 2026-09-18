<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Team extends Model
{
    protected $fillable = [
        'branch_id',
        'name',
        'code',
        'team_leader_id',
        'is_active',
    ];

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    public function leader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'team_leader_id');
    }

    public function members(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function dailyDiaries(): HasMany
    {
        return $this->hasMany(DailyDiary::class);
    }

    public function customers(): HasMany
    {
        return $this->hasMany(Customer::class);
    }
}
