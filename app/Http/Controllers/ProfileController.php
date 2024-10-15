<?php

namespace App\Http\Controllers;

use App\Models\Borrow;
use Illuminate\View\View;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Redirect;
use App\Http\Requests\ProfileUpdateRequest;
use App\Models\Book;
use App\Models\Category;


class ProfileController extends Controller
{
    /**
     * Get the count of borrowed books for the current user.
     */
    public function indexUser(): JsonResponse
    {
        $books = Book::where('status', 'available')
                     ->with('category')
                     ->groupBy('title', 'author', 'publisher', 'year') // Group by these fields
                     ->select('id', 'title', 'author', 'publisher', 'year', 'category_id', 'status')
                     ->paginate(10);
        return response()->json($books, 200);
    }
    public function adminDashboard(): JsonResponse
    {
        $bookCount = Book::count();
        $categoryCount = Category::count();
        $borrowCount = Borrow::count();

        return response()->json([
            'book_count' => $bookCount,
            'category_count' => $categoryCount,
            'borrow_count' => $borrowCount
        ], 200);
    }

    public function borrowedBooksCount(Request $request): JsonResponse
    {
        if (!Gate::allows('isUser', $request->user())) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $count = Borrow::where('user_id', $request->user()->id)
                       ->whereNull('returned_at')
                       ->count();

        return response()->json(['borrowed_books_count' => $count], 200);
    }

    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): View
    {
        $borrowedBooksCount = $this->borrowedBooksCount($request);

        return view('profile.edit', [
            'user' => $request->user(),
            'borrowedBooksCount' => $borrowedBooksCount,
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit')->with('status', 'profile-updated');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validateWithBag('userDeletion', [
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
