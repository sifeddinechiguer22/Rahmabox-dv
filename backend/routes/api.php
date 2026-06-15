<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DonationItemController;
use App\Http\Controllers\ChatController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login',    [AuthController::class, 'login']);
    Route::post('/google',   [AuthController::class, 'googleAuth']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me',      [AuthController::class, 'me']);

    // Items CRUD routes
    Route::apiResource('items', DonationItemController::class);

    // Chat routes
    Route::get('/chats', [ChatController::class, 'index']);
    Route::post('/chats', [ChatController::class, 'storeSession']);
    Route::get('/chats/{session}/messages', [ChatController::class, 'messages']);
    Route::post('/chats/{session}/messages', [ChatController::class, 'sendMessage']);
});
