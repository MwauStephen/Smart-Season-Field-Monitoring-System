<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\FieldController;
use App\Http\Controllers\FieldUpdateController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\UserController;

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::get('/dashboard/stats', [DashboardController::class, 'getDashboardStats']);

    Route::get('/fields', [FieldController::class, 'getAllFields']);
    Route::post('/fields', [FieldController::class, 'createNewField']);
    Route::get('/fields/{id}', [FieldController::class, 'getFieldDetails']);
    Route::put('/fields/{id}', [FieldController::class, 'updateField']);
    Route::delete('/fields/{id}', [FieldController::class, 'deleteField']);

    Route::get('/fields/{id}/updates', [FieldUpdateController::class, 'getFieldHistory']);
    Route::post('/fields/{id}/updates', [FieldUpdateController::class, 'logFieldUpdate']);

    // User management (Admin only)
    Route::get('/agents', [UserController::class, 'getAgents']);
    Route::post('/users', [UserController::class, 'createNewUser']);
});
require __DIR__.'/auth.php';
