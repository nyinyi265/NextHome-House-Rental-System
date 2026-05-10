<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Services\AuthService;
use App\Http\Requests\Auth\RegisterTenantRequest;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Responses\Auth\AuthResponse;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;
use App\Traits\HttpResponse;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Support\Facades\Storage;

class AuthController extends Controller
{
    use HttpResponse;

    protected AuthService $service;

    public function __construct(AuthService $service)
    {
        $this->service = $service;
    }

    /**
     * Register tenant endpoint
     */
    public function register(RegisterTenantRequest $request): JsonResponse
    {
        $profilePath = null;
        if ($request->hasFile('profile_path')) {
            $file = $request->file('profile_path');
            $profilePath = $file->store('profiles', 'public');
        }

        $data = $request->validated();
        $data['profile_path'] = $profilePath;

        $result = $this->service->registerTenant($data);
        return $this->success(true, AuthResponse::register($result['user'], $result['token']), 'Tenant registered successfully', 201);
    }

    /**
     * Login endpoint returns token
     */
    public function login(LoginRequest $request): JsonResponse
    {
        try {
            $result = $this->service->login($request->email, $request->password);
            return $this->success(true, AuthResponse::login($result['user'], $result['token']), 'Login successful', 200);
        } catch (AuthenticationException $e) {
            return $this->fail(false, null, $e->getMessage(), 401);
        }
    }

    /**
     * Logout current user (requires auth)
     */
    public function logout(Request $request): JsonResponse
    {
        $this->service->logout($request);
        return $this->success(true, null, 'Logged out successfully', 200);
    }

    /**
     * Return current authenticated user
     */
    public function me(Request $request): JsonResponse
    {
        return $this->success(true, AuthResponse::me($this->service->me($request)), 'User retrieved', 200);
    }

    /**
     * Update current authenticated user profile
     */
    public function updateProfile(Request $request): JsonResponse
    {
        // dd($request->all(), $request->file('profile_path'));
        $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|max:255|unique:users,email,' . $request->user()->id,
            'phone_number' => 'sometimes|string|max:20',
            'address' => 'sometimes|string|max:500',
            'profile_path' => 'sometimes|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $data = $request->except(['email']);
        if ($request->hasFile('profile_path')) {

            if ($request->user()->profile_path) {
                Storage::disk('public')->delete($request->user()->profile_path);
            }

            $path = $request->file('profile_path')->store('profiles', 'public');

            $data['profile_path'] = $path;
        }

        $user = $this->service->updateProfile($request->user(), $data);
        return $this->success(true, AuthResponse::me($user), 'Profile updated successfully', 200);
    }

    /**
     * Send password reset link to user's email
     */
    public function forgotPassword(Request $request): JsonResponse
    {
        $request->validate(['email' => 'required|email']);

        $status = $this->service->sendPasswordResetLink($request->email);

        if ($status === 'passwords.sent') {
            return $this->success(true, null, 'Password reset link sent to your email', 200);
        }

        return $this->fail(false, null, 'Unable to send password reset link', 400);
    }

    /**
     * Reset user password
     */
    public function resetPassword(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email',
            'token' => 'required|string',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $status = $this->service->resetPassword(
            $request->email,
            $request->token,
            $request->password
        );

        if ($status === 'passwords.reset') {
            return $this->success(true, null, 'Password reset successfully', 200);
        }

        return $this->fail(false, null, 'Invalid or expired reset token', 400);
    }

    /**
     * Change user password (requires current password verification)
     */
    public function changePassword(Request $request): JsonResponse
    {
        $request->validate([
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:8|confirmed',
        ]);

        $result = $this->service->changePassword(
            $request->user(),
            $request->current_password,
            $request->new_password
        );

        if ($result['success']) {
            return $this->success(true, null, 'Password changed successfully', 200);
        }

        return $this->fail(false, null, $result['message'], 400);
    }
}
