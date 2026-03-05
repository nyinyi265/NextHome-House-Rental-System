<?php

namespace App\Http\Responses\Landlord;

use App\Models\HousePhoto;

class HousePhotoResponse
{
    public static function list($photos): array
    {
        return ['photos' => $photos];
    }

    public static function single(HousePhoto $photo): array
    {
        return ['photo' => $photo];
    }

    public static function created(HousePhoto $photo): array
    {
        return ['photo' => $photo];
    }

    public static function updated(HousePhoto $photo): array
    {
        return ['photo' => $photo];
    }

    public static function deleted(): array
    {
        return ['message' => 'Photo deleted'];
    }
}
