<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Http\Request;

class AuthService
{
    /**
     * Register a new tenant user and issue a token.
     *
     * @param array $data
     * @return array{user: \App\Models\User, token: string}
     */
    public function registerTenant(array $data): array
    {
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'phone_number' => $data['phone_number'] ?? null,
            'profile_path' => $data['profile_path'] ?? null,
        ]);

        // assign tenant role (assumes role already exists)
        if (method_exists($user, 'assignRole')) {
            $user->assignRole('tenant');
        }

        // create tenant profile with emergency contact if provided
        if (!empty($data['emergency_contact'])) {
            $user->tenantProfile()->create([
                'emergency_contact' => $data['emergency_contact'],
            ]);
        }
        $token = $user->createToken('auth-token')->plainTextToken;

        return ['user' => $user, 'token' => $token];
    }

    /**
     * Attempt to log in a user and generate a token.
     *
     * @param string $email
     * @param string $password
     * @return array
     * @throws AuthenticationException
     */
    public function login(string $email, string $password): array
    {
        $user = User::where('email', $email)->first();
        if (!$user || !Hash::check($password, $user->password)) {
            throw new AuthenticationException('The provided credentials are incorrect.');
        }

        $token = $user->createToken('auth-token')->plainTextToken;
        return ['user' => $user, 'token' => $token];
    }

    /**
     * Revoke current user's token (logout).
     *
     * @param Request $request
     * @return void
     */
    public function logout(Request $request): void
    {
        $request->user()->currentAccessToken()->delete();
    }

    /**
     * Return the currently authenticated user.
     *
     * @param Request $request
     * @return User|null
     */
    public function me(Request $request): ?User
    {
        return $request->user();
    }

    /**
     * Update the user's profile.
     *
     * @param User $user
     * @param array $data
     * @return User
     */
    public function updateProfile(User $user, array $data): User
    {
        if (isset($data['name'])) {
            $user->name = $data['name'];
        }
        if (isset($data['phone'])) {
            $user->phone_number = $data['phone'];
        }
        if (isset($data['profile_path'])) {
            $user->profile_path = $data['profile_path'];
        }
        $user->save();

        return $user;
    }

    /**
     * Send password reset link to user.
     *
     * @param string $email
     * @return string
     */
    public function sendPasswordResetLink(string $email): string
    {
        $user = User::where('email', $email)->first();

        if (!$user) {
            return 'passwords.user';
        }

        // Generate password reset token
        $token = app('auth.password.broker')->createToken($user);

        // Send email (simplified - in production use proper notification)
        // You would need to create a Notification class
        // For now, we just return success

        return 'passwords.sent';
    }

    /**
     * Reset user password.
     *
     * @param string $email
     * @param string $token
     * @param string $password
     * @return string
     */
    public function resetPassword(string $email, string $token, string $password): string
    {
        $user = User::where('email', $email)->first();

        if (!$user) {
            return 'passwords.user';
        }

        $result = app('auth.password.broker')->reset(
            [
                'email' => $email,
                'password' => $password,
                'password_confirmation' => $password,
                'token' => $token
            ],
            function ($user, $password) {
                $user->password = Hash::make($password);
                $user->save();
            }
        );

        return $result;
    }
}
