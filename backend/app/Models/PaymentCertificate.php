<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PaymentCertificate extends Model
{
    protected $fillable = [
        'certificate_no',
        'deal_id',
        'prepared_by_finance_id',
        'gross_amount',
        'tax_withheld',
        'net_disbursed',
        'ceo_approved',
        'ceo_approved_at',
        'ceo_id',
        'payment_status',
        'disbursed_at',
    ];

    protected $casts = [
        'gross_amount' => 'decimal:2',
        'tax_withheld' => 'decimal:2',
        'net_disbursed' => 'decimal:2',
        'ceo_approved' => 'boolean',
        'ceo_approved_at' => 'datetime',
        'disbursed_at' => 'datetime',
    ];

    public function deal(): BelongsTo
    {
        return $this->belongsTo(SalesDeal::class, 'deal_id');
    }

    public function preparedByFinance(): BelongsTo
    {
        return $this->belongsTo(User::class, 'prepared_by_finance_id');
    }

    public function ceo(): BelongsTo
    {
        return $this->belongsTo(User::class, 'ceo_id');
    }

    public function disbursements(): HasMany
    {
        return $this->hasMany(CommissionDisbursement::class);
    }
}
