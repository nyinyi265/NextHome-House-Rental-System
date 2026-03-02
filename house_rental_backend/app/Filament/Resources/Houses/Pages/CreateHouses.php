<?php

namespace App\Filament\Resources\Houses\Pages;

use App\Filament\Resources\Houses\HousesResource;
use App\Trait\RedirectToIndex;
use Filament\Resources\Pages\CreateRecord;

class CreateHouses extends CreateRecord
{
    protected static string $resource = HousesResource::class;
}
