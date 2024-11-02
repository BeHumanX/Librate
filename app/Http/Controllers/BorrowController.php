<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\User;
use App\Models\Borrow;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\JsonResponse;

class BorrowController extends Controller
{
    public function index(): JsonResponse
    {
        $borrows = Borrow::all();
        return response()->json($borrows, 200);
    }

    public function borrowBook(Request $request): JsonResponse
    {
        if (auth()->user()->role === 'admin') {
            return response()->json(['error' => 'Admins cannot borrow books'], 403);
        }
        $validatedData = $request->validate([
            'book_id' => 'required|exists:books,id',
            'borrow_date' => 'required|date',
            'return_date' => 'required|date|after:borrow_date',
        ]);

        // Add the authenticated user's ID to the validated data
        $validatedData['user_id'] = auth()->id();

        $book = Book::findOrFail($validatedData['book_id']);

        if ($book->status !== 'available') {
            return response()->json(['error' => 'Book is not available for borrowing'], 400);
        }

        DB::beginTransaction();

        try {
            $book->update(['status' => 'borrowed']);
            $borrow = Borrow::create($validatedData);

            DB::commit();
            return response()->json(['borrow' => $borrow, 'book' => $book->fresh()], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Failed to borrow the book. Please try again.'], 500);
        }
    }

    public function returnBook(Borrow $borrow): JsonResponse
    {
        if ($borrow->returned_at) {
            return response()->json(['error' => 'Book has already been returned'], 400);
        }
        $borrow->update([
            'returned_at' => now(),
        ]);

        $book = Book::findOrFail($borrow->book_id);
        $book->update(['status' => 'available']);

        return response()->json($borrow, 200);
    }

    public function show(Borrow $borrow): JsonResponse
    {
        return response()->json($borrow, 200);
    }

    public function userBorrowedBooks(User $user): JsonResponse
    {
        $borrowedBooks = Borrow::where('user_id', $user->id)->get();
        return response()->json($borrowedBooks, 200);
    }
}
