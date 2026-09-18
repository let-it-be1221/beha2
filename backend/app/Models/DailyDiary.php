<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DailyDiary extends Model
{
    protected $fillable = [
        'report_date',
        'member_id',
        'team_id',
        'calls_made',
        'customers_registered',
        'field_visits_conducted',
        'activity_summary',
        'challenges_encountered',
        'reviewed_by_leader_id',
        'leader_notes',
        'status',
    ];

    protected $casts = [
        'report_date' => 'date',
        'calls_made' => 'integer',
        'customers_registered' => 'integer',
        'field_visits_conducted' => 'integer',
    ];

    public function member(): BelongsTo
    {
        return $this->belongsTo(User::class, 'member_id');
    }

    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by_leader_id');
    }
}
