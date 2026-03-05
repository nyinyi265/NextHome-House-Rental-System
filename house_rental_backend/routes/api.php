<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\Landlord\HouseController;

Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
    Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
    Route::get('me', [AuthController::class, 'me'])->middleware('auth:sanctum');
});

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// landlord-only house CRUD API
Route::prefix('landlord')->middleware(['auth:sanctum', 'role:landlord'])->group(function () {
    Route::apiResource('houses', HouseController::class)
        ->only(['index', 'store', 'show', 'update', 'destroy']);

    // house photo management
    Route::prefix('houses/{house}/photos')->group(function () {
        Route::get('/', [App\Http\Controllers\API\Landlord\HousePhotoController::class, 'index']);
        Route::post('/', [App\Http\Controllers\API\Landlord\HousePhotoController::class, 'store']);
        Route::get('/{photo}', [App\Http\Controllers\API\Landlord\HousePhotoController::class, 'show']);
        Route::put('/{photo}', [App\Http\Controllers\API\Landlord\HousePhotoController::class, 'update']);
        Route::delete('/{photo}', [App\Http\Controllers\API\Landlord\HousePhotoController::class, 'destroy']);
    });
});
