<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BookController;
use App\Http\Controllers\BorrowController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\CategoryController;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::get('/admin/dashboard', [ProfileController::class, 'adminDashboard']);
Route::get('/user/available-books', [ProfileController::class, 'indexUser']);

require __DIR__.'/auth.php';

Route::resource('categories', CategoryController::class);
Route::resource('books', BookController::class);
Route::post('/books/{book}/maintenance', [BookController::class, 'maintenance'])->name('books.maintenance');

Route::post('/borrows', [BorrowController::class, 'borrowBook'])->name('borrows.borrow');
Route::post('/borrows/{borrow}/return', [BorrowController::class, 'returnBook'])->name('borrows.return');
Route::get('/borrows', [BorrowController::class, 'index'])->name('borrows.index');
Route::get('/user/borrowed-books', [BorrowController::class, 'userBorrowedBooks'])->name('borrows.user');
