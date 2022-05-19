<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Validation\Rules\Password;
use Illuminate\Support\Facades\Auth;
/**
 * class AuthController
 * @author Emmy britt <beritogwu@gmail.com />
 * @package App\Http\Controllers
 */

class AuthController extends Controller
{
    public function register(Request $request)
    {
        // <!-- Validate the request -->
        $data = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|string|unique:users,email',
            'password' => [
                'required',
                'confirmed',
                Password::min(8)->mixedCase()->numbers()->symbols()
            ]
        ]);

        // send validated request to database
        /**@var \App\Models\User $user */
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => bcrypt($data['password']),
        ]);
        // Generate token for each user
        $token = $user->createToken('main')->plainTextToken;

        // send user and response to the frontend
        return response([
            'user' => $user,
            'token' => $token,
        ]);
    }
    

    public function login(Request $request)
    {
        // validate the request
        $credentials = $request->validate([
            'email' => 'required|string|exists:users,email',
            'password' => [
                'required'
            ],
            'remember' => 'boolean',
        ]);

        $remember = $credentials['remember'] ?? false;
        unset($credentials['remember']);

        if(!Auth::attempt($credentials, $remember)){
            return response([
                'error' => 'The provided credentials are not correct'
            ], 422);
        }
        $user = Auth::user();
        $token = $user->createToken('main')->plainTextToken;
        return response([
            'user' => $user,
            'token' => $token
        ]);
        
    }

    public function logout()
    {
        $user = Auth::user();

        $user->currentAccessToken()->delete();
        return response([
            'success' => true
        ]);
    }
}
