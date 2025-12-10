<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    // Fungsi untuk menampilkan daftar produk di Dashboard
    public function index()
    {
        // Ambil data produk beserta info kategori-nya, urutkan dari yang terbaru
        return Product::with('category')->latest()->get();
    }

    // Fungsi untuk menambah produk baru
    public function store(Request $request)
    {
        // [PERUBAHAN] Cek Hak Akses: Hanya Admin yang boleh
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Akses ditolak! Hanya Admin yang boleh menambah produk.'], 403);
        }

        $validated = $request->validate([
            'category_id' => 'required',
            'sku' => 'required|unique:products',
            'name' => 'required',
            'stock' => 'required|integer',
            'price' => 'required|numeric',
        ]);

        $product = Product::create($validated);
        return response()->json(['message' => 'Produk dibuat', 'data' => $product], 201);
    }


    public function destroy(Request $request, $id)
    {
        // 1. Cek Security: Hanya Admin
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Akses ditolak! Hanya Admin yang boleh menghapus.'], 403);
        }

        // 2. Cari Produk
        $product = Product::find($id);

        if (!$product) {
            return response()->json(['message' => 'Produk tidak ditemukan'], 404);
        }

        // 3. Hapus
        $product->delete();

        return response()->json(['message' => 'Produk berhasil dihapus']);
    }

}