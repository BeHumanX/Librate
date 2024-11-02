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
    $this->adminUser = User::factory()->create(['role' => 'admin']);
    $this->normalUser = User::factory()->create(['role' => 'user']);
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
    $this->book->update(['status' => 'available']);
    $borrowData = [
        'book_id' => $this->book->id, 
        'borrow_date' => Carbon::now(),
        'return_date' => Carbon::now()->addDays(rand(1, 10)), 
    ];
    $response = $this->actingAs($this->normalUser)->postJson('/borrows', $borrowData);
    $response->assertStatus(JsonResponse::HTTP_CREATED)
             ->assertJsonFragment(['book_id' => $this->book->id]);

    $borrowId = $response->json('borrow.id');
    $this->assertDatabaseHas('borrows', ['id' => $borrowId]);
});

it('successfully returns a borrow', function () {
    $this->book->update(['status' => 'borrowed']);
    $borrow = Borrow::factory()->create([
        'book_id' => $this->book->id,
        'user_id' => $this->normalUser->id,
        'borrow_date' => Carbon::now(),
        'return_date' => Carbon::now()->addDays(rand(1, 10)),
        'returned_at' => null,
    ]);
    $response = $this->actingAs($this->normalUser)
                    ->putJson("/borrows/{$borrow->id}/return");
    $response->assertStatus(JsonResponse::HTTP_OK);
    $borrow->refresh();
    $this->book->refresh();
    $this->assertNotNull($borrow->returned_at, 'Returned at should be set');
    $this->assertEquals('available', $this->book->status, 'Book status should be available');
    $this->assertDatabaseHas('borrows', [
        'id' => $borrow->id,
        'book_id' => $this->book->id,
        'user_id' => $this->normalUser->id,
    ]);
});
it('fails to return a borrow that has already been returned', function () {
    $this->book->update(['status' => 'borrowed']);
    $borrow = Borrow::factory()->create([
        'book_id' => $this->book->id,
        'user_id' => $this->normalUser->id,
        'returned_at' => Carbon::now(),
    ]);
    $response = $this->actingAs($this->normalUser)
                    ->putJson("/borrows/{$borrow->id}/return");
    $response->assertStatus(JsonResponse::HTTP_BAD_REQUEST);
});
it('forbids admin from borrowing a book', function () {
    $borrowData = [
        'book_id' => $this->book->id, 
        'borrow_date' => Carbon::now(),
        'return_date' => Carbon::now()->addDays(rand(1, 10)), 
    ];
    $response = $this->actingAs($this->adminUser)->postJson('/borrows', $borrowData);
    $response->assertStatus(JsonResponse::HTTP_FORBIDDEN);
}); 