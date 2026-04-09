<?php

namespace App\Filament\Resources\LandlordRequests\Tables;

use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class LandlordRequestsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('user.name')
                    ->label('Name')
                    ->searchable(),
                TextColumn::make('user.email')
                    ->label('Email')
                    ->searchable(),
                TextColumn::make('user.phone_number')
                    ->label('Phone')
                    ->searchable(),
                TextColumn::make('status')
                    ->label('Status')
                    ->badge()
                    ->color(fn ($state) => match($state) {
                        'approved' => 'success',
                        'rejected' => 'danger',
                        default => 'warning',
                    }),
                TextColumn::make('verified_at')
                    ->label('Verified At')
                    ->dateTime()
                    ->sortable(),
                TextColumn::make('created_at')
                    ->label('Applied')
                    ->dateTime()
                    ->sortable(),
            ])
            ->filters([
                //
            ])
            ->recordActions([
                //
            ])
            ->toolbarActions([
                //
            ]);
    }
}