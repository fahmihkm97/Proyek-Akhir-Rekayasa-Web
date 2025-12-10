<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    // Hanya Admin yang boleh akses controller ini
    
    public function index(Request $request)
    {
        if ($request->user()->role !== 'admin') abort(403, 'Unauthorized');
        return User::latest()->get();
    }

    public function store(Request $request)
    {
        if ($request->user()->role !== 'admin') abort(403, 'Unauthorized');

        $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6',
            'role' => 'required|in:admin,user'
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role
        ]);

        return response()->json(['message' => 'Staff berhasil ditambahkan', 'data' => $user], 201);
    }

    public function update(Request $request, $id)
    {
        if ($request->user()->role !== 'admin') abort(403, 'Unauthorized');

        $user = User::find($id);
        
        $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:users,email,'.$id,
            'role' => 'required|in:admin,user'
        ]);

        $data = [
            'name' => $request->name,
            'email' => $request->email,
            'role' => $request->role,
        ];

        if ($request->password) {
            $data['password'] = Hash::make($request->password);
        }

        $user->update($data);
        return response()->json(['message' => 'Data staff diperbarui']);
    }

    public function destroy(Request $request, $id)
    {
        if ($request->user()->role !== 'admin') abort(403, 'Unauthorized');
        if ($request->user()->id == $id) return response()->json(['message' => 'Tidak bisa hapus diri sendiri'], 400);

        User::destroy($id);
        return response()->json(['message' => 'Staff dihapus']);
    }
}