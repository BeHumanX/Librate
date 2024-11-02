<?php

use App\Models\Book;
use App\Models\User;
use App\Models\Category;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\JsonResponse;

uses(RefreshDatabase::class);

beforeEach(function () {
    // Create a user with admin role for authorization tests
    $this->adminUser = User::factory()->create(['role' => 'admin']);
    // Create a user with user role for authorization tests
    $this->normalUser = User::factory()->create(['role' => 'user']);
    
    // Create a category for testing
    $this->category = Category::factory()->create();
});

it('returns books on index', function () {
    // Create some books
    Book::factory()->count(5)->create();

    $response = $this->getJson('/books');

    $response->assertStatus(JsonResponse::HTTP_OK)
             ->assertJsonStructure([
                 'current_page',
                 'data' => [
                     '*' => [
                         'id',
                         'title',
                         'author',
                         'publisher',
                         'year',
                         'category_id',
                         'status',
                     ],
                 ],
             ]);
});

it('creates a book', function () {
    $bookData = [
        'title' => 'Test Book',
        'author' => 'Test Author',
        'publisher' => 'Test Publisher',
        'year' => 2023,
        'category_id' => $this->category->id,
    ];

    $response = $this->actingAs($this->adminUser)->postJson('/books', $bookData);

    $response->assertStatus(JsonResponse::HTTP_CREATED)
             ->assertJsonFragment(['title' => 'Test Book']);

    $this->assertDatabaseHas('books', ['title' => 'Test Book']);
});

it('returns a book', function () {
    $book = Book::factory()->create();

    $response = $this->getJson("/books/{$book->id}");

    $response->assertStatus(JsonResponse::HTTP_OK)
             ->assertJsonFragment(['id' => $book->id]);
});

it('updates a book', function () {
    // Create a book to update
    $book = Book::factory()->create([
        'title' => 'Original Title',
        'author' => 'Original Author',
        'publisher' => 'Original Publisher',
        'year' => 2023,
        'category_id' => $this->category->id,
    ]);
    $newCategory = Category::factory()->create(['name' => 'New Category']);

    $updatedData = [
        'title' => 'Updated Title',
        'author' => 'Updated Author',
        'publisher' => 'Updated Publisher',
        'year' => 2024,
        'category_id' => $newCategory->id, // Updated to new category
        'status' => 'available', // You can set this to any valid status
    ];

    $response = $this->actingAs($this->adminUser)->putJson("/books/{$book->id}", $updatedData);
    // dd($response->getContent());

    $response->assertStatus(JsonResponse::HTTP_OK)
             ->assertJsonFragment(['title' => 'Updated Title']) // Check for updated title
             ->assertJsonFragment(['author' => 'Updated Author']) // Check for updated author
             ->assertJsonFragment(['publisher' => 'Updated Publisher']) // Check for updated publisher
             ->assertJsonFragment(['year' => 2024]) // Check for updated year
             ->assertJsonFragment(['category_id' => $newCategory->id]); // Check for updated category_id

    // Verify that the database has the updated values
    $this->assertDatabaseHas('books', [
        'id' => $book->id,
        'title' => 'Updated Title',
        'author' => 'Updated Author',
        'publisher' => 'Updated Publisher',
        'year' => 2024,
        'category_id' => $newCategory->id,
    ]);
});

it('deletes a book', function () {
    $book = Book::factory()->create();

    $response = $this->actingAs($this->adminUser)->deleteJson("/books/{$book->id}");

    $response->assertStatus(JsonResponse::HTTP_NO_CONTENT);
    $this->assertDatabaseMissing('books', ['id' => $book->id]);
});

it('forbids normal user from creating a book', function () {
    $bookData = [
        'title' => 'Test Book',
        'author' => 'Test Author',
        'publisher' => 'Test Publisher',
        'year' => 2023,
        'category_id' => $this->category->id,
    ];

    $response = $this->actingAs($this->normalUser)->postJson('/books', $bookData);

    $response->assertStatus(JsonResponse::HTTP_FORBIDDEN)
             ->assertJson(['error' => 'You are not authorized to add book']);
});

// Additional tests for update and delete authorization can be added similarly
