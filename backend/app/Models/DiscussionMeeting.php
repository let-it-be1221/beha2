<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DiscussionMeeting extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'meeting_type',
        'tier_scope',
        'organizer_id',
        'scheduled_at',
        'location_or_link',
        'agenda',
        'decision_log',
        'status',
    ];

    protected $casts = [
        'scheduled_at' => 'datetime',
    ];

    public function organizer()
    {
        return $this->belongsTo(User::class, 'organizer_id');
    }
}
