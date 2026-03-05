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
        $data = $request->validated();
        if ($request->hasFile('profile_path')) {
            $data['profile_path'] = $request->file('profile_path')->store('profiles', 'public');
        }
        $result = $this->service->registerTenant($data);
        // result now contains user and token
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
}
