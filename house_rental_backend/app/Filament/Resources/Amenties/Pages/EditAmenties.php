<?php

namespace App\Filament\Resources\Amenties\Pages;

use App\Filament\Resources\Amenties\AmentiesResource;
use App\Trait\RedirectToIndex;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditAmenties extends EditRecord
{
    use RedirectToIndex;
    protected static string $resource = AmentiesResource::class;

    protected function getHeaderActions(): array
    {
        return [
            // DeleteAction::make(),
        ];
    }
}
