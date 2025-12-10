<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    // IZINKAN KOLOM INI DIISI:
    protected $fillable = [
        'category_id',
        'sku',
        'name',
        'stock',
        'price'
    ];

    // Relasi ke Kategori
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    // Relasi ke Transaksi (Satu produk punya banyak riwayat)
    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }
}