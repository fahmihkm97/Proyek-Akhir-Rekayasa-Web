<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * (Dijalankan saat php artisan migrate)
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Menambahkan kolom 'role'
            // Tipe ENUM memastikan isinya hanya bisa 'admin' atau 'user'
            $table->enum('role', ['admin', 'user'])
                  ->default('user') // Jika tidak diisi, otomatis jadi 'user'
                  ->after('email'); // Posisi kolom diletakkan setelah email
        });
    }

    /**
     * Reverse the migrations.
     * (Dijalankan saat php artisan migrate:rollback)
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Menghapus kolom role jika migrasi dibatalkan
            $table->dropColumn('role');
        });
    }
};