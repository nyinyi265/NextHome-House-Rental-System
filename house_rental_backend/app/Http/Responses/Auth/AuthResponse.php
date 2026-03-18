<?php

namespace App\Http\Responses\Auth;

use App\Models\User;

class AuthResponse
{
    /**
     * Response payload for a newly registered user.
     * Token is optional to allow backward compatibility.
     *
     * @param User $user
     * @param string|null $token
     * @return array
     */
    public static function register(User $user, string $token): array
    {
        $response = ['user' => $user];
        if ($token !== null) {
            $response['token'] = $token;
            $response['role'] = $user->getRoleNames()->first() ?? null;
        }
        return $response;
    }

    public static function login(User $user, string $token): array
    {
        return [
            'user' => $user,
            'token' => $token,
            'role' => $user->getRoleNames()->first() ?? null,
        ];
    }

    public static function me(User $user): array
    {
        return [
            'user' => $user,
            'role' => $user->getRoleNames()->first() ?? null,
        ];
    }
}
