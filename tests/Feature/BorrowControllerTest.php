<?php

use App\Models\Borrow;
use App\Models\Book;
use App\Models\User;
use Database\Factories\BookFactory;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;

uses(RefreshDatabase::class);
beforeEach(function () {
    // Create a user with admin role for authorization tests
    $this->adminUser = User::factory()->create(['role' => 'admin']);
    // Create a user with user role for authorization tests
    $this->normalUser = User::factory()->create(['role' => 'user']);

    // Create a category for testing
    $this->book = Book::factory()->create();
});

it('returns borrows on index', function () {
    Borrow::factory()->count(5)->create();
    $response = $this->getJson('/borrows');
    $response->assertStatus(JsonResponse::HTTP_OK)->assertJsonStructure([
        '*' => [
            'id',
            'book_id',
            'borrow_date',
            'user_id',
            'return_date',
        ]
    ]);
});
it('successfuly borrow a book for user', function () {
    // Ensure the book is available for borrowing
    $this->book->update(['status' => 'available']);
    $borrowData = [
        'book_id' => $this->book->id, 
        'borrow_date' => Carbon::now(),
        'return_date' => Carbon::now()->addDays(rand(1, 10)), 
    ];
    $response = $this->actingAs($this->normalUser)->postJson('/borrows', $borrowData);
    $response->assertStatus(JsonResponse::HTTP_CREATED)
             ->assertJsonFragment(['book_id' => $this->book->id]);

    // Retrieve the borrow ID from the response
    $borrowId = $response->json('borrow.id');
    $this->assertDatabaseHas('borrows', ['id' => $borrowId]);
});

it('successfuly returns a borrow', function (){
    $this->book->update(['status' => 'borrowed']);
    $borrow = Borrow::factory()->create([
        'book_id' => $this->book->id,
        'borrow_date' => Carbon::now(),
        'return_date' => Carbon::now()->addDays(rand(1, 10)), 
    ]);
});