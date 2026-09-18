<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Property extends Model
{
    protected $fillable = [
        'developer_contract_id',
        'property_code',
        'title',
        'property_type',
        'price',
        'advance_payment',
        'area_sqm',
        'bedrooms',
        'bathrooms',
        'subcity',
        'specific_area',
        'description',
        'images',
        'intake_by_gen_head_id',
        'verified_by_info_dept_id',
        'is_published',
        'published_at',
        'status',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'advance_payment' => 'decimal:2',
        'area_sqm' => 'decimal:2',
        'images' => 'array',
        'is_published' => 'boolean',
        'published_at' => 'datetime',
    ];

    public function developerContract(): BelongsTo
    {
        return $this->belongsTo(DeveloperContract::class);
    }

    public function intakeByGenHead(): BelongsTo
    {
        return $this->belongsTo(User::class, 'intake_by_gen_head_id');
    }

    public function verifiedByInfoDept(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verified_by_info_dept_id');
    }

    public function deals(): HasMany
    {
        return $this->hasMany(SalesDeal::class);
    }
}
