<?php

use App\Http\Controllers\JugadorController;
use Illuminate\Support\Facades\Route;

Route::apiResource('jugadores', JugadorController::class);
