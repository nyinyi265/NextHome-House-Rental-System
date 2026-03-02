<?php

namespace App\Filament\Resources\Amenties\Pages;

use App\Filament\Resources\Amenties\AmentiesResource;
use App\Trait\RedirectToIndex;
use Filament\Resources\Pages\CreateRecord;

class CreateAmenties extends CreateRecord
{
    use RedirectToIndex;
    protected static string $resource = AmentiesResource::class;
}
