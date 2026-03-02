<?php

namespace App\Filament\Resources\Houses\Pages;

use App\Filament\Resources\Houses\HousesResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListHouses extends ListRecords
{
    protected static string $resource = HousesResource::class;

    protected function getHeaderActions(): array
    {
        return [
            // CreateAction::make(),
        ];
    }
}
