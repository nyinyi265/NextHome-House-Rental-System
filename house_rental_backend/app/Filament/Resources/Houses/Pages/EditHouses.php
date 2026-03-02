<?php

namespace App\Filament\Resources\Houses\Pages;

use App\Filament\Resources\Houses\HousesResource;
use App\Trait\RedirectToIndex;
use Filament\Actions\DeleteAction;
use Filament\Actions\ForceDeleteAction;
use Filament\Actions\RestoreAction;
use Filament\Resources\Pages\EditRecord;

class EditHouses extends EditRecord
{
    protected static string $resource = HousesResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
            ForceDeleteAction::make(),
            RestoreAction::make(),
        ];
    }
}
