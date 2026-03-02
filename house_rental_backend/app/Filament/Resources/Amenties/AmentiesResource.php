<?php

namespace App\Filament\Resources\Amenties;

use App\Filament\Resources\Amenties\Pages\CreateAmenties;
use App\Filament\Resources\Amenties\Pages\EditAmenties;
use App\Filament\Resources\Amenties\Pages\ListAmenties;
use App\Filament\Resources\Amenties\Schemas\AmentiesForm;
use App\Filament\Resources\Amenties\Tables\AmentiesTable;
use App\Models\Amenties;
use App\Models\Amenty;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class AmentiesResource extends Resource
{
    protected static ?string $model = Amenty::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::ChartBar;

    protected static ?string $recordTitleAttribute = 'Amenty';

    public static function form(Schema $schema): Schema
    {
        return AmentiesForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return AmentiesTable::configure($table);
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
            'index' => ListAmenties::route('/'),
            'create' => CreateAmenties::route('/create'),
            'edit' => EditAmenties::route('/{record}/edit'),
        ];
    }
}
