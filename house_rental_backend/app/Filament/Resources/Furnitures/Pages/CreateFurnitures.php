<?php

namespace App\Filament\Resources\Furnitures\Pages;

use App\Filament\Resources\Furnitures\FurnituresResource;
use App\Trait\RedirectToIndex;
use Filament\Resources\Pages\CreateRecord;

class CreateFurnitures extends CreateRecord
{
    use RedirectToIndex;
    protected static string $resource = FurnituresResource::class;
}
