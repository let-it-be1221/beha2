<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class SalesDeal extends Model
{
    protected $fillable = [
        'deal_code',
        'property_id',
        'customer_id',
        'agent_id',
        'team_id',
        'branch_id',
        'generation_id',
        'sale_price',
        'gross_commission',
        'bank_reference',
        'deal_status',
    ];

    protected $casts = [
        'sale_price' => 'decimal:2',
        'gross_commission' => 'decimal:2',
    ];

    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class);
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function agent(): BelongsTo
    {
        return $this->belongsTo(User::class, 'agent_id');
    }

    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    public function generation(): BelongsTo
    {
        return $this->belongsTo(Generation::class);
    }

    public function paymentCertificate(): HasOne
    {
        return $this->hasOne(PaymentCertificate::class, 'deal_id');
    }
}
