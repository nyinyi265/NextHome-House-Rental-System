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
        Schema::create('houses', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->integer('apartment_number');
            $table->enum('type',  ['apartment', 'house', 'condo']);
            $table->integer('floor');
            $table->integer('area');
            $table->string('street');
            $table->string('township');
            $table->string('city');
            $table->integer('bedrooms');
            $table->integer('bathrooms');
            $table->text('description');
            $table->decimal('price', '10', '2');
            $table->boolean('is_available');
            $table->date('available_from');
            $table->date('deleted_at')->nullable();
            $table->foreignId('landlord_profile_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('houses');
    }
};
