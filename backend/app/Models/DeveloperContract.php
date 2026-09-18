<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DeveloperContract extends Model
{
    protected $fillable = [
        'developer_name',
        'contract_ref',
        'agreed_commission_rate',
        'start_date',
        'expiry_date',
        'ceo_signed',
        'terms_summary',
    ];

    protected $casts = [
        'start_date' => 'date',
        'expiry_date' => 'date',
        'ceo_signed' => 'boolean',
        'agreed_commission_rate' => 'decimal:2',
    ];

    public function properties(): HasMany
    {
        return $this->hasMany(Property::class);
    }
}
