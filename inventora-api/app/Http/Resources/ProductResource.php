<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
{
    return [
        'id' => $this->id,
        'sku' => $this->sku,
        'name' => $this->name,
        'stock_status' => $this->stock > 10 ? 'Aman' : 'Menipis', // Logika visual
        'current_stock' => $this->stock,
        'price_formatted' => 'Rp ' . number_format($this->price, 0, ',', '.'),
        'category' => $this->category->name,
        'last_updated' => $this->updated_at->diffForHumans(),
    ];
}
}
