<?php

namespace App\Filament\Resources\Furnitures\Pages;

use App\Filament\Resources\Furnitures\FurnituresResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListFurnitures extends ListRecords
{
    protected static string $resource = FurnituresResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
