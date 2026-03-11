<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RoleAndPermissionSeeder::class,
        ]);

        $user = User::create([
            'name' => 'PlatformAdmin',
            'email' => 'nexthomeadmin@gmail.com',
            'password' => bcrypt('NextHomeAdmin123!'),
            'phone_number' => '1234567890',
            'profile_path' => null,
            'deleted_at' => null,
            'delete_flg' => null,
        ]);

        $user->assignRole('admin');

        $landlord = User::create([
            'name' => 'John Doe',
            'email' => 'johndoe@gmail.com',
            'password' => bcrypt('JohnDoe123!'),
            'phone_number' => '1234567890',
            'profile_path' => null,
            'deleted_at' => null,
            'delete_flg' => null,
        ]);

        $landlord->assignRole('landlord');

        $tenant = User::create([
            'name' => 'Jane Smith',
            'email' => 'janesmith@gmail.com',
            'password' => bcrypt('JaneSmith123!'),
            'phone_number' => '1234567890',
            'profile_path' => null,
            'deleted_at' => null,
            'delete_flg' => null,
        ]);

        $tenant->assignRole('tenant');
    }
}
