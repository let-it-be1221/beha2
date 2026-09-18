<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GenerationSummaryReport extends Model
{
    protected $fillable = [
        'generation_id',
        'generation_head_id',
        'period_start',
        'period_end',
        'total_sales_volume',
        'total_deals_closed',
        'aggregated_tendency_analysis',
        'operational_highlights',
        'submitted_to_ceo_at',
    ];

    protected $casts = [
        'period_start' => 'date',
        'period_end' => 'date',
        'total_sales_volume' => 'decimal:2',
        'total_deals_closed' => 'integer',
        'submitted_to_ceo_at' => 'datetime',
    ];

    public function generation(): BelongsTo
    {
        return $this->belongsTo(Generation::class);
    }

    public function generationHead(): BelongsTo
    {
        return $this->belongsTo(User::class, 'generation_head_id');
    }
}
