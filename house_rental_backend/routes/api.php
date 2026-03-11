<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\Landlord\AmentyController;
use App\Http\Controllers\API\Landlord\FurnitureController;
use App\Http\Controllers\API\Landlord\HouseController;
use App\Http\Controllers\API\Landlord\HousePhotoController;
use App\Http\Controllers\API\Tenant\HouseController as TenantHouseController;

Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    // name login so unauthenticated middleware can redirect without error
    Route::post('login', [AuthController::class, 'login'])->name('login');
    Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
    Route::get('me', [AuthController::class, 'me'])->middleware('auth:sanctum');
    Route::put('profile', [AuthController::class, 'updateProfile'])->middleware('auth:sanctum');
    // Change password (requires authentication)
    Route::post('change-password', [AuthController::class, 'changePassword'])->middleware('auth:sanctum');
    // Password reset routes (public)
    Route::post('forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('reset-password', [AuthController::class, 'resetPassword']);
});

// public browsing routes for houses (available to guests and tenants)
Route::get('houses', [TenantHouseController::class, 'index']);
Route::get('houses/{house}', [TenantHouseController::class, 'show']);

// public amenities route
Route::get('amenties', [AmentyController::class, 'index']);

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// tenant APIs
Route::prefix('tenant')->middleware(['auth:sanctum', 'role:tenant'])->group(function () {
    Route::apiResource('rental-applications', App\Http\Controllers\API\Tenant\RentalApplicationController::class)
        ->only(['index', 'store', 'show', 'update', 'destroy']);

    Route::apiResource('rentals', App\Http\Controllers\API\Tenant\RentalController::class)
        ->only(['index', 'show']);

    // tenants can only browse houses
    Route::apiResource('houses', TenantHouseController::class)
        ->only(['index', 'show']);
});

// landlord-only house and application APIs
Route::prefix('landlord')->middleware(['auth:sanctum', 'role:landlord'])->group(function () {
    Route::apiResource('houses', HouseController::class)
        ->only(['index', 'store', 'show', 'update', 'destroy']);

    // house photo management
    Route::prefix('houses/{house}/photos')->group(function () {
        Route::get('/', [HousePhotoController::class, 'index']);
        Route::post('/', [HousePhotoController::class, 'store']);
        Route::get('/{photo}', [HousePhotoController::class, 'show']);
        Route::put('/{photo}', [HousePhotoController::class, 'update']);
        Route::delete('/{photo}', [HousePhotoController::class, 'destroy']);
    });

    // amenities and furniture management
    Route::apiResource('amenties', AmentyController::class)
        ->only(['index', 'store', 'show', 'update', 'destroy']);
    Route::apiResource('furnitures', FurnitureController::class)
        ->only(['index', 'store', 'show', 'update', 'destroy']);

    // rental applications belonging to landlord's houses
    Route::apiResource('rental-applications', App\Http\Controllers\API\Landlord\RentalApplicationController::class)
        ->only(['index', 'show', 'update', 'destroy']);

    // rentals on landlord's properties
    Route::apiResource('rentals', App\Http\Controllers\API\Landlord\RentalController::class)
        ->only(['index', 'store', 'show', 'update', 'destroy']);
});
