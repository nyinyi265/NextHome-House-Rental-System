<?php

namespace App\Http\Responses\Landlord;

use App\Models\House;

class HouseResponse
{
    public static function list($houses): array
    {
        return ['houses' => $houses];
    }

    public static function single(House $house): array
    {
        return ['house' => $house];
    }

    public static function created(House $house): array
    {
        return ['house' => $house];
    }

    public static function updated(House $house): array
    {
        return ['house' => $house];
    }

    public static function deleted(): array
    {
        return ['message' => 'House deleted'];
    }
}
