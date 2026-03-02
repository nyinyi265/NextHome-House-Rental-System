<?php

namespace App\Filament\Resources\Amenties\Pages;

use App\Filament\Resources\Amenties\AmentiesResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListAmenties extends ListRecords
{
    protected static string $resource = AmentiesResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
