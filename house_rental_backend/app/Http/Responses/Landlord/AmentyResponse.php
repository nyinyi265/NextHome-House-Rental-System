<?php

namespace App\Http\Responses\Landlord;

use App\Models\Amenty;

class AmentyResponse
{
    public static function list($amenties): array
    {
        return ['amenties' => $amenties];
    }

    public static function single(Amenty $amenty): array
    {
        return ['amenty' => $amenty];
    }

    public static function created(Amenty $amenty): array
    {
        return ['amenty' => $amenty];
    }

    public static function updated(Amenty $amenty): array
    {
        return ['amenty' => $amenty];
    }

    public static function deleted(): array
    {
        return ['message' => 'Amenty deleted'];
    }
}
