<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasFactory;

    // IZINKAN KOLOM INI DIISI:
    protected $fillable = [
        'product_id',
        'user_id',
        'type',
        'quantity',
        'notes'
    ];

    // Relasi ke Produk
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    // Relasi ke User (Siapa yang input)
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}