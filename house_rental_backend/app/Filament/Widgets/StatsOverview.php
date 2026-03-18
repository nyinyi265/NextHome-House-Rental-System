<?php

namespace App\Filament\Widgets;

use App\Models\House;
use App\Models\LandlordProfile;
use App\Models\TenantProfile;
use App\Models\Rental;
use App\Models\RentalApplication;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class StatsOverviewWidget extends BaseWidget
{
    protected function getStats(): array
    {
        // Total Properties ( Houses )
        $totalProperties = House::count();

        // Total Landlords
        $totalLandlords = LandlordProfile::count();

        // Total Tenants
        $totalTenants = TenantProfile::count();

        // Total Rentals (active rentals)
        $totalRentals = Rental::count();

        // Total Rental Applications
        $totalApplications = RentalApplication::count();

        // Pending Applications
        $pendingApplications = RentalApplication::where('status', 'pending')->count();

        // Approved Applications
        $approvedApplications = RentalApplication::where('status', 'approved')->count();

        // Rejected Applications
        $rejectedApplications = RentalApplication::where('status', 'rejected')->count();

        return [
            Stat::make('Total Properties', $totalProperties)
                ->description('All registered properties')
                ->icon('heroicon-o-home')
                ->color('primary'),

            Stat::make('Total Landlords', $totalLandlords)
                ->description('Property owners')
                ->icon('heroicon-o-user-group')
                ->color('success'),

            Stat::make('Total Tenants', $totalTenants)
                ->description('Active tenants')
                ->icon('heroicon-o-users')
                ->color('info'),

            Stat::make('Total Rentals', $totalRentals)
                ->description('Active rental contracts')
                ->icon('heroicon-o-document-text')
                ->color('warning'),

            Stat::make('Total Applications', $totalApplications)
                ->description("Pending: {$pendingApplications} | Approved: {$approvedApplications} | Rejected: {$rejectedApplications}")
                ->icon('heroicon-o-clipboard-document-list')
                ->color('gray'),
        ];
    }
}
