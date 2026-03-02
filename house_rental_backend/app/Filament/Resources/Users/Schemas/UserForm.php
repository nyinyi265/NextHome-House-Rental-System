<?php

namespace App\Filament\Resources\Users\Schemas;

use Dom\Text;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class UserForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name')->label('Name')->required(),
                TextInput::make('email')->label('Email')->email()->required(),
                TextInput::make('password')->label('Password')->password()->required(),
                TextInput::make('phone_number')->label('Phone Number')->tel()->required(),
                FileUpload::make('profile_path')->label('Profile Picture')->image()->directory('profile_pictures')->columnSpan('full'),
            ]);
    }
}
