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
                TextColumn::make('tenant_profile.name')->label('Tenant Name')->searchable(),
                TextColumn::make('house_id.title')->label('House Title')->searchable(),
                TextColumn::make('proposed_start_date')->label('Proposed Start Date')->date(),
                TextColumn::make('proposed_end_date')->label('Proposed End Date')->date(),
                TextColumn::make('message')->label('Message'),
                IconColumn::make('status')->label('Status')->boolean(),
                TextColumn::make('applied_at')->label('Applied At')->dateTime(),
            ])
            ->filters([
                //
            ])
            ->recordActions([
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
