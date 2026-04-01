<?php

use Illuminate\Support\Facades\Route;

Route::get('/house-photo/{filename}', function ($filename) {

    $path = storage_path('app/public/house_photos/' . $filename);

    if (!file_exists($path)) {
        abort(404);
    }

    return response()->file($path);

});
