<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TransactionController extends Controller
{
    // 1. LIHAT RIWAYAT
    public function index()
    {
        return Transaction::with(['product', 'user'])->latest()->get();
    }

    // 2. TAMBAH TRANSAKSI (Update Stok Otomatis)
    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'type'       => 'required|in:in,out',
            'quantity'   => 'required|integer|min:1',
            'notes'      => 'nullable|string'
        ]);

        try {
            return DB::transaction(function () use ($request) {
                // Lock baris produk biar aman saat banyak request
                $product = Product::lockForUpdate()->find($request->product_id);

                // Cek stok khusus barang keluar
                if ($request->type === 'out' && $product->stock < $request->quantity) {
                    throw new \Exception("Stok tidak cukup! Sisa: {$product->stock}");
                }

                // Update Stok Real-time
                if ($request->type === 'in') {
                    $product->increment('stock', $request->quantity);
                } else {
                    $product->decrement('stock', $request->quantity);
                }

                // Simpan Riwayat
                $transaction = Transaction::create([
                    'product_id' => $request->product_id,
                    'user_id'    => $request->user()->id, 
                    'type'       => $request->type,
                    'quantity'   => $request->quantity,
                    'notes'      => $request->notes ?? '-'
                ]);

                return response()->json([
                    'message' => 'Sukses update stok',
                    'data' => $transaction,
                    'sisa_stok' => $product->stock
                ], 201);
            });

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal memproses transaksi',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // 3. UPDATE TRANSAKSI (Hanya Catatan)
    public function update(Request $request, $id)
    {
        $trx = Transaction::find($id);
        if (!$trx) return response()->json(['message' => 'Data tidak ditemukan'], 404);


        $trx->update(['notes' => $request->notes]);
        
        return response()->json(['message' => 'Catatan transaksi diperbarui']);
    }

    // 4. HAPUS TRANSAKSI (Rollback Stok)
    public function destroy($id)
    {
        $trx = Transaction::find($id);
        if (!$trx) return response()->json(['message' => 'Data tidak ditemukan'], 404);

        $product = Product::find($trx->product_id);

        if ($trx->type === 'in') {
            $product->decrement('stock', $trx->quantity);
        } else {
            $product->increment('stock', $trx->quantity);
        }

        $trx->delete();
        return response()->json(['message' => 'Riwayat dihapus, stok dikembalikan ke posisi semula']);
    }
}