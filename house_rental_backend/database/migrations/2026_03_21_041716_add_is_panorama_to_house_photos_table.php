<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('house_photos', function (Blueprint $table) {
            $table->boolean('is_panorama')->default(false)->after('photo_path');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('house_photos', function (Blueprint $table) {
            $table->dropColumn('is_panorama');
        });
    }
};
