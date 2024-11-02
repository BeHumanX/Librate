<?php

use App\Models\Category;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\JsonResponse;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->adminUser = User::factory()->create(['role' => 'admin']);
    $this->normalUser = User::factory()->create(['role' => 'user']);
});

it('return categories on index', function () {
    Category::factory()->count(5)->create();
    $response = $this->getJson('/categories');
    $response->assertStatus(JsonResponse::HTTP_OK)
        ->assertJsonStructure([
            '*' => [
                'id',
                'name'
            ]
        ]);
});
it('creates a category', function () {
    $categoryData = [
        'name' => 'Test Category'
    ];
    $response = $this->actingAs($this->adminUser)->postJson('/categories', $categoryData);
    $response->assertStatus(JsonResponse::HTTP_CREATED)->assertJsonFragment(['name' => 'Test Category']);
    $this->assertDatabaseHas('categories', ['name' => 'Test Category']);
});
it('returns a category', function () {
    $category = Category::factory()->create();
    $response = $this->getJson("/categories/{$category->id}");
    $response->assertStatus(JsonResponse::HTTP_OK)->assertJsonFragment(['id' => $category->id]);
});
it('update a category', function () {
    $category = Category::factory()->create(['name' => 'Original Category']);
    $updatedData = [
        'name' => 'Updated Category'
    ];
    $response = $this->actingAs($this->adminUser)->putJson("/categories/{$category->id}", $updatedData);
    $response->assertStatus(JsonResponse::HTTP_OK)->assertJsonFragment(['name' => 'Updated Category']);
    $this->assertDatabaseHas('categories', [
        'name' => 'Updated Category',
    ]);
});
it('deletes a category', function () {
    $category = Category::factory()->create();
    $response = $this->actingAs($this->adminUser)->deleteJson("/categories/{$category->id}");
    $response->assertStatus(JsonResponse::HTTP_NO_CONTENT);
    $this->assertDatabaseMissing('categories', ['id' => $category->id]);
});
it('forbids a normal user from creating a category', function () {
    $categoryData = [
        'name' => 'Test Category'
    ];
    $response = $this->actingAs($this->normalUser)->postJson('/categories', $categoryData);
    $response->assertStatus(JsonResponse::HTTP_FORBIDDEN)->assertJson(['error' => 'You are not authorized to add category']);
});
