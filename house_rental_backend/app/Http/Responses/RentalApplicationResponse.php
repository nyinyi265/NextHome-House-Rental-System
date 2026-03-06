<?php

namespace App\Http\Responses;

use App\Models\RentalApplication;

class RentalApplicationResponse
{
    public static function list($applications): array
    {
        return ['rental_applications' => $applications];
    }

    public static function single(RentalApplication $application): array
    {
        return ['rental_application' => $application];
    }

    public static function created(RentalApplication $application): array
    {
        return ['rental_application' => $application];
    }

    public static function updated(RentalApplication $application): array
    {
        return ['rental_application' => $application];
    }

    public static function deleted(): array
    {
        return ['message' => 'Rental application deleted'];
    }
}
