<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Task\Http\Controllers\TaskController;
use App\Modules\Task\Http\Controllers\ProjectController;

//basic route
Route::name('app.')->group(function () {
  Route::get('', [App\Http\Controllers\HomeController::class, 'index'])->name('index');

  Route::name('tasks.')->prefix('tasks')->group(function () {
    Route::get('', [TaskController::class, 'index'])->name('index');
    Route::post('create', [TaskController::class, 'store'])->name('store');
    Route::put('{task}/edit', [TaskController::class, 'update'])->name('update');
    Route::patch('{task}/complete', [TaskController::class, 'complete'])->name('complete');
    Route::delete('{task}/delete', [TaskController::class, 'delete'])->name('delete');
  });

  Route::name('projects.')->prefix('projects')->group(function () {
    Route::get('', [ProjectController::class, 'index'])->name('index');
    Route::post('create', [ProjectController::class, 'store'])->name('store');
    Route::put('{category}/edit', [ProjectController::class, 'update'])->name('update');
    Route::delete('{category}/delete', [ProjectController::class, 'delete'])->name('delete');
  });
});
