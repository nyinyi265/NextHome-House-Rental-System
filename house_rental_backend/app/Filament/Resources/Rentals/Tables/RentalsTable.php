<?php

namespace App\Filament\Resources\Rentals\Tables;

use Dom\Text;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ForceDeleteBulkAction;
use Filament\Actions\RestoreBulkAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\TrashedFilter;
use Filament\Tables\Table;

class RentalsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('house.title')->label('House Title')->searchable(),
                TextColumn::make('tenant_profile.name')->label('Tenant Name')->searchable(),
                TextColumn::make('rental_start_date')->label('Start Date')->date(),
                TextColumn::make('rental_end_date')->label('End Date')->date(),
                TextColumn::make('rental_duration')->label('Duration (months)'),
                TextColumn::make('monthly_rent')->label('Monthly Rent'),
                TextColumn::make('status')->label('Status'),
                TextColumn::make('deleted_at')->label('Deleted At')->dateTime('Y-m-d'),
            ])
            ->filters([
                TrashedFilter::make(),
            ])
            ->recordActions([
                EditAction::make(),
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
