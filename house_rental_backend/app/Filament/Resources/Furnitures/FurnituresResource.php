<?php

namespace App\Filament\Resources\Furnitures;

use App\Filament\Resources\Furnitures\Pages\CreateFurnitures;
use App\Filament\Resources\Furnitures\Pages\EditFurnitures;
use App\Filament\Resources\Furnitures\Pages\ListFurnitures;
use App\Filament\Resources\Furnitures\Schemas\FurnituresForm;
use App\Filament\Resources\Furnitures\Tables\FurnituresTable;
use App\Models\Furniture;
use App\Models\Furnitures;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class FurnituresResource extends Resource
{
    protected static ?string $model = Furniture::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::Cube;

    protected static ?string $recordTitleAttribute = 'Furniture';

    public static function form(Schema $schema): Schema
    {
        return FurnituresForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return FurnituresTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListFurnitures::route('/'),
            'create' => CreateFurnitures::route('/create'),
            'edit' => EditFurnitures::route('/{record}/edit'),
        ];
    }
}
