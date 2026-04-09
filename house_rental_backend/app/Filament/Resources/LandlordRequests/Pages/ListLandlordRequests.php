<?php

namespace App\Filament\Resources\LandlordRequests\Pages;

use App\Filament\Resources\LandlordRequests\LandlordRequestsResource;
use App\Filament\Resources\LandlordRequests\Tables\LandlordRequestsTable;
use Filament\Resources\Pages\ListRecords;

class ListLandlordRequests extends ListRecords
{
    protected static string $resource = LandlordRequestsResource::class;

    protected function getHeaderActions(): array
    {
        return [
            //
        ];
    }
}