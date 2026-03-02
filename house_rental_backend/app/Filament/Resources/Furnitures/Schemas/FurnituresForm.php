<?php

namespace App\Filament\Resources\Furnitures\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class FurnituresForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name')->label('Name')->required()->columnSpan('full'),
            ]);
    }
}
