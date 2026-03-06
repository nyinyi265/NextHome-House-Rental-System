<?php

namespace App\Http\Responses;

use App\Models\Rental;

class RentalResponse
{
    public static function list($rentals): array
    {
        return ['rentals' => $rentals];
    }

    public static function single(Rental $rental): array
    {
        return ['rental' => $rental];
    }

    public static function created(Rental $rental): array
    {
        return ['rental' => $rental];
    }

    public static function updated(Rental $rental): array
    {
        return ['rental' => $rental];
    }

    public static function deleted(): array
    {
        return ['message' => 'Rental deleted'];
    }
}
