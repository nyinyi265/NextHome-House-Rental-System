<?php

namespace App\Filament\Resources\RentalApplications\Pages;

use App\Filament\Resources\RentalApplications\RentalApplicationsResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListRentalApplications extends ListRecords
{
    protected static string $resource = RentalApplicationsResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
