<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    // INI YANG KURANG TADI:
    // Kita harus mengizinkan kolom ini diisi
    protected $fillable = [
        'name',
        'description',
    ];

    // Relasi: Satu kategori punya banyak produk
    public function products()
    {
        return $this->hasMany(Product::class);
    }
}