<?php

namespace App\Filament\Resources\LandlordRequests;

use App\Filament\Resources\LandlordRequests\Pages\ListLandlordRequests;
use App\Models\LandlordProfile;
use BackedEnum;
use Filament\Actions\Action;
use Filament\Resources\Resource;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class LandlordRequestsResource extends Resource
{
    protected static ?string $model = LandlordProfile::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::UserPlus;

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                \Filament\Tables\Columns\TextColumn::make('user.name')
                    ->label('Name')
                    ->searchable(),
                \Filament\Tables\Columns\TextColumn::make('user.email')
                    ->label('Email')
                    ->searchable(),
                \Filament\Tables\Columns\TextColumn::make('user.phone_number')
                    ->label('Phone')
                    ->searchable(),
                \Filament\Tables\Columns\TextColumn::make('status')
                    ->label('Status')
                    ->badge()
                    ->color(fn ($state) => match($state) {
                        'approved' => 'success',
                        'rejected' => 'danger',
                        default => 'warning',
                    }),
                \Filament\Tables\Columns\TextColumn::make('verified_at')
                    ->label('Verified At')
                    ->dateTime(),
                \Filament\Tables\Columns\TextColumn::make('created_at')
                    ->label('Applied')
                    ->dateTime(),
            ])
            ->recordActions([
                Action::make('approve')
                    ->label('Approve')
                    ->action(function ($record) {
                        $record->update([
                            'status' => 'approved',
                            'verified_at' => now(),
                        ]);
                    })
                    ->visible(fn ($record) => $record->status === 'pending')
                    ->color('success'),
                Action::make('reject')
                    ->label('Reject')
                    ->action(function ($record) {
                        $record->update([
                            'status' => 'rejected',
                        ]);
                    })
                    ->visible(fn ($record) => $record->status === 'pending')
                    ->color('danger'),
            ])
            ->filters([
                //
            ]);
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
            'index' => ListLandlordRequests::route('/'),
        ];
    }
}