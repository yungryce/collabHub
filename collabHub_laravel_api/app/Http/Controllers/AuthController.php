<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Register a new user.
     *
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */

    public function register(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => ['required', 'string', 'max:255'],
                'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:users'],
                'password' => ['required', 'confirmed', Rules\Password::defaults()]
            ]);
        } catch (ValidationException  $e) {
            return response()->json([
                'errors' => $e->validator->errors(),
            ], 422);
        }
        // Create and save the new user
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role_id' => Role::where('name', 'regular')->first()->id, // Assign regular role
        ]);

        // Return a response indicating success
        return response()->json([
            'status' =>'success',
            'message' => 'User registered successfully',
        ], 201);
    }
    
    public function login(Request $request)
    {
        // Validate the request data
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);
    
        // Attempt to authenticate the user
        if (!Auth::attempt($credentials)) {
            // Authentication failed
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid credentials',
            ], 401);
        }
    
        // Authentication successful
        $user = Auth::user();
    
        // Retrieve the user details from the database
        $userFromDB = User::where('email', $credentials['email'])->first();
    
        // Compare the user details
        if (!$userFromDB || !Hash::check($credentials['password'], $userFromDB->password)) {
            // Authentication failed
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid credentials',
            ], 401);
        }
    
        // Generate a token with expiration time (1 day)
        $token = $user->createToken('api-token', ['DAY_1'])->plainTextToken;
    
        // Return the user details and token in the JSON response
        return response()->json([
            'status' => 'success',
            'message' => 'Login successful',
            'user' => $userFromDB,
            'token' => $token,
        ]);
    }
    

    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Logged out successfully',
        ]);
    }
}
