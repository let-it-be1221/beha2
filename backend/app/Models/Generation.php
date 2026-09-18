<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Generation extends Model
{
    protected $fillable = [
        'name',
        'code',
        'generation_head_id',
        'is_active',
    ];

    public function head(): BelongsTo
    {
        return $this->belongsTo(User::class, 'generation_head_id');
    }

    public function branches(): HasMany
    {
        return $this->hasMany(Branch::class);
    }

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function summaryReports(): HasMany
    {
        return $this->hasMany(GenerationSummaryReport::class);
    }
}
