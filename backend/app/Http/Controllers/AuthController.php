<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Http\Requests\RegisterRequest;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Register a new user.
     */
    public function register(RegisterRequest $request)
    {
        $user = User::create([
            'name'                => $request->name,
            'email'               => $request->email,
            'password'            => Hash::make($request->password),
            'phone'               => $request->phone,
            'city'                => $request->city,
            'role'                => $request->role ?? 'donateur',
            'company_name'        => $request->company_name,
            'registration_number' => $request->registration_number,
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'data'  => new UserResource($user),
            'token' => $token
        ], 201);
    }

    /**
     * Authenticate user and return token.
     */
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Email aw password ghalat.'],
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'data'  => new UserResource($user),
            'token' => $token
        ]);
    }

    /**
     * Authenticate via Google.
     */
    public function googleAuth(Request $request)
    {
        $request->validate([
            'name'  => 'required|string',
            'email' => 'required|email',
        ]);

        $user = User::firstOrCreate(
            ['email' => $request->email],
            [
                'name'     => $request->name,
                'password' => Hash::make(str()->random(24)),
                'role'     => 'donateur',
                'phone'    => $request->phone ?? null,
            ]
        );

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'data'  => new UserResource($user),
            'token' => $token
        ]);
    }

    /**
     * Log user out.
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out']);
    }

    /**
     * Get current authenticated user profile.
     */
    public function me(Request $request)
    {
        return response()->json([
            'data' => new UserResource($request->user())
        ]);
    }
}
