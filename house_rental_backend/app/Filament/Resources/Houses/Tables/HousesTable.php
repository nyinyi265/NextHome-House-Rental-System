<?php

namespace App\Filament\Resources\Houses\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ForceDeleteBulkAction;
use Filament\Actions\RestoreBulkAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\TrashedFilter;
use Filament\Tables\Table;

class HousesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('title')->label('Title'),
                TextColumn::make('description')->label('Description'),
                TextColumn::make('bedrooms')->label('Bedrooms'),
                TextColumn::make('bathrooms')->label('Bathrooms'),
                TextColumn::make('apartment_number')->label('Apartment Number'),
                TextColumn::make('type')->label('Type'),
                TextColumn::make('floor')->label('Floor'),
                TextColumn::make('area')->label('Area'),
                TextColumn::make('street')->label('Street'),
                TextColumn::make('township')->label('Township'),
                TextColumn::make('city')->label('City'),
                TextColumn::make('price')->label('Price'),
                IconColumn::make('is_available')->label('Available')->boolean(),
                TextColumn::make('available_from')->label('Available From')->date('Y-m-d'),
                TextColumn::make('deleted_at')->label('Deleted At')->dateTime('Y-m-d H:i:s'),
            ])
            ->filters([
                TrashedFilter::make(),
            ])
            ->recordActions([
                // EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                    ForceDeleteBulkAction::make(),
                    RestoreBulkAction::make(),
                ]),
            ]);
    }
}
