<?php

namespace App\Filament\Resources\RentalApplications;

use App\Filament\Resources\RentalApplications\Pages\CreateRentalApplications;
use App\Filament\Resources\RentalApplications\Pages\EditRentalApplications;
use App\Filament\Resources\RentalApplications\Pages\ListRentalApplications;
use App\Filament\Resources\RentalApplications\Schemas\RentalApplicationsForm;
use App\Filament\Resources\RentalApplications\Tables\RentalApplicationsTable;
use App\Models\RentalApplication;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class RentalApplicationsResource extends Resource
{
    protected static ?string $model = RentalApplication::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::ClipboardDocumentCheck;

    public static function form(Schema $schema): Schema
    {
        return RentalApplicationsForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return RentalApplicationsTable::configure($table);
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
            'index' => ListRentalApplications::route('/'),
            'create' => CreateRentalApplications::route('/create'),
            'edit' => EditRentalApplications::route('/{record}/edit'),
        ];
    }
}
