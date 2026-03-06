<?php

namespace App\Http\Responses\Landlord;

use App\Models\Furniture;

class FurnitureResponse
{
    public static function list($furnitures): array
    {
        return ['furnitures' => $furnitures];
    }

    public static function single(Furniture $furniture): array
    {
        return ['furniture' => $furniture];
    }

    public static function created(Furniture $furniture): array
    {
        return ['furniture' => $furniture];
    }

    public static function updated(Furniture $furniture): array
    {
        return ['furniture' => $furniture];
    }

    public static function deleted(): array
    {
        return ['message' => 'Furniture deleted'];
    }
}
