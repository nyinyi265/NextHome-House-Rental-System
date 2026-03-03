<?php

namespace App\Filament\Resources\Houses\Schemas;

use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Components\ToggleButtons;
use Filament\Schemas\Schema;

class HousesForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('title')->label('Title')->required(),
                TextInput::make('description')->label('Description')->required(),
                TextInput::make('bedrooms')->label('Bedrooms')->numeric()->required(),
                TextInput::make('bathrooms')->label('Bathrooms')->numeric()->required(),
                TextInput::make('apartment_number')->label('Apartment Number')->required(),
                TextInput::make('type')->label('Type')->required(),
                TextInput::make('floor')->label('Floor')->required(),
                TextInput::make('area')->label('Area')->required(),
                TextInput::make('street')->label('Street')->required(),
                TextInput::make('township')->label('Township')->required(),
                TextInput::make('city')->label('City')->required(),
                TextInput::make('price')->label('Price')->numeric()->required(),
                Toggle::make('is_available')->label('Is Available')->required(),
                DatePicker::make('available_from')->label('Available From')->native(false)->required(),
                Repeater::make('housePhotos')
                    ->relationship()
                    ->schema([
                        FileUpload::make('photo_path')
                            ->image()
                            ->directory('house-photos')
                            ->required(),
                    ])
                    ->columnSpanFull()
            ]);
    }
}
