<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CommissionDisbursement extends Model
{
    protected $fillable = [
        'payment_certificate_id',
        'beneficiary_id',
        'beneficiary_role',
        'split_percentage',
        'net_amount',
        'tax_amount',
        'is_paid',
        'paid_at',
    ];

    protected $casts = [
        'split_percentage' => 'decimal:2',
        'net_amount' => 'decimal:2',
        'tax_amount' => 'decimal:2',
        'is_paid' => 'boolean',
        'paid_at' => 'datetime',
    ];

    public function paymentCertificate(): BelongsTo
    {
        return $this->belongsTo(PaymentCertificate::class);
    }

    public function beneficiary(): BelongsTo
    {
        return $this->belongsTo(User::class, 'beneficiary_id');
    }
}
