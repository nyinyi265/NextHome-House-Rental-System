<?php

namespace App\Filament\Resources\RentalApplications\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class RentalApplicationsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('house.title')->label('House Title')->searchable(),
                TextColumn::make('tenantProfile.user.name')->label('Tenant Name')->searchable(),
                TextColumn::make('landlordProfile.user.name')->label('Landlord Name')->searchable(),
                TextColumn::make('application_date')->label('Application Date')->date(),
                TextColumn::make('message')->label('Message'),
                IconColumn::make('status')->label('Status')->boolean(),
                TextColumn::make('created_at')->label('Applied At')->date(),
            ])
            ->filters([
                //
            ])
            ->recordActions([
                // EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
