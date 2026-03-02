<?php

namespace App\Filament\Resources\RentalApplications\Pages;

use App\Filament\Resources\RentalApplications\RentalApplicationsResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditRentalApplications extends EditRecord
{
    protected static string $resource = RentalApplicationsResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
