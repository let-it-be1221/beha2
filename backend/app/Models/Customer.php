<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Customer extends Model
{
    protected $fillable = [
        'full_name',
        'phone',
        'alternate_phone',
        'email',
        'budget_min',
        'budget_max',
        'preferred_property_type',
        'preferred_locations',
        'client_inclination',
        'registered_by_id',
        'team_id',
        'branch_id',
        'status',
    ];

    protected $casts = [
        'preferred_locations' => 'array',
        'budget_min' => 'decimal:2',
        'budget_max' => 'decimal:2',
    ];

    public function registeredBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'registered_by_id');
    }

    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }
}
