<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\TaskController;
use Illuminate\Support\Facades\Route;


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/user/{user}/roles', [RoleController::class, 'getUserRoles']);
    Route::post('/user/assign-role', [RoleController::class, 'assignRole'])
        ->middleware('privileged');
    
    Route::apiResource('/tasks', TaskController::class)
        ->only(['index', 'store', 'show', 'update','destroy']);
});
