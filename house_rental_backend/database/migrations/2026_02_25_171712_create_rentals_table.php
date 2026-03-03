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
        Schema::create('rentals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('house_id')->constrained()->onDelete('cascade');
            $table->foreignId('tenant_profile_id')->constrained()->onDelete('cascade');
            $table->date('rental_start_date');
            $table->date('rental_end_date')->nullable();
            $table->integer('rental_duration')->nullable();
            $table->decimal('monthly_rent', 10, 2);
            $table->enum('status', ['active', 'inactive'])->default('inactive');
            $table->date('deleted_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rentals');
    }
};
