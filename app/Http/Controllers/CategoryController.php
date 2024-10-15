<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CategoryController extends Controller
{
    public function index(): JsonResponse
    {
        $categories = Category::all();
        return response()->json($categories, 200);
    }

    public function store(Request $request): JsonResponse
    {
        if(auth()->user()->role !== 'admin'){
            return response()->json(['error' => 'You are not authorized to add categories'], 403);
        }
        $validatedData = $request->validate([
            'name' => 'required|string|max:255|unique:categories',
        ]);

        $category = Category::create($validatedData);
        return response()->json($category, 201);
    }

    public function show(Category $category): JsonResponse
    {
        return response()->json($category, 200);
    }

    public function update(Request $request, Category $category): JsonResponse
    {
        if(auth()->user()->role !== 'admin'){
            return response()->json(['error' => 'You are not authorized to update categories'], 403);
        }
        $validatedData = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name,' . $category->id,
        ]);

        $category->update($validatedData);
        return response()->json($category, 200);
    }

    public function destroy(Category $category): JsonResponse
    {
        $category->delete();
        return response()->json(null, 204);
    }
}
