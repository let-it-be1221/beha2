<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SystemUpgrade extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'version',
        'study_notes',
        'impact_assessment',
        'status',
        'submitted_by_id',
        'ceo_approved_by_id',
        'deployed_at',
    ];

    protected $casts = [
        'deployed_at' => 'datetime',
    ];

    public function submittedBy()
    {
        return $this->belongsTo(User::class, 'submitted_by_id');
    }

    public function ceoApprovedBy()
    {
        return $this->belongsTo(User::class, 'ceo_approved_by_id');
    }
}
