<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class BookController extends Controller
{
    public function index(): JsonResponse
    {
        $books = Book::with(['category' => function($query) {
            $query->select('id', 'name');
        }])
        ->select('id', 'title', 'author', 'publisher', 'year', 'category_id', 'status')
        ->paginate(10);
        return response()->json($books, 200);
    }

    public function store(Request $request): JsonResponse
    {
        if(auth()->user()->role == 'user'){
            return response()->json(['error' => 'You are not authorized to add books'], 403);
        }
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'author' => 'required|string|max:255',
            'publisher' => 'required|string|max:255',
            'year' => 'required|integer|min:1000|max:' . (date('Y') + 1),
            'category_id' => 'required|exists:categories,id',
        ]);

        $book = Book::with('category')->create($validatedData);
        return response()->json($book, 201);
    }

    public function show(Book $book): JsonResponse
    {
        return response()->json($book, 200);
    }

    public function update(Request $request, Book $book): JsonResponse
    {
        if(auth()->user()->role == 'user'){
            return response()->json(['error' => 'You are not authorized to update books'], 403);
        }
        $validatedData = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'author' => 'sometimes|required|string|max:255',
            'publisher' => 'sometimes|required|string|max:255',
            'year' => 'sometimes|required|integer|min:1000|max:' . (date('Y') + 1),
            'category_id' => 'sometimes|required|exists:categories,id',
            'status' => 'sometimes|required|in:available,borrowed,maintenance',
        ]);

        $book->with('category')->update($validatedData);
        return response()->json($book, 200);
    }

    public function destroy(Book $book): JsonResponse
    {
        $book->delete();
        return response()->json(null, 204);
    }
    public function maintenance(Book $book): JsonResponse
    {
        if(auth()->user()->role == 'user'){
            return response()->json(['error' => 'You are not authorized to update books'], 403);
        }
        if($book->status == 'available'){
            $book->update(['status' => 'maintenance']);
        }
        return response()->json($book, 200);
    }
}
