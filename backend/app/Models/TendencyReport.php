<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TendencyReport extends Model
{
    protected $fillable = [
        'branch_id',
        'branch_manager_id',
        'period_start',
        'period_end',
        'demanded_property_types',
        'average_budget',
        'market_tendency_summary',
        'customer_objections_analysis',
        'status',
        'submitted_at',
    ];

    protected $casts = [
        'period_start' => 'date',
        'period_end' => 'date',
        'submitted_at' => 'datetime',
        'demanded_property_types' => 'array',
        'average_budget' => 'decimal:2',
    ];

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    public function branchManager(): BelongsTo
    {
        return $this->belongsTo(User::class, 'branch_manager_id');
    }
}
