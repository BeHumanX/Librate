<?php

namespace Database\Factories;

use App\Models\Book;
use Illuminate\Database\Eloquent\Factories\Factory;

class BookFactory extends Factory
{
    protected $model = Book::class;

    public function definition()
    {
        return [
            'title' => $this->faker->sentence(3),
            'author' => $this->faker->name,
            'publisher' => $this->faker->company,
            'year' => $this->faker->year,
            'status' => $this->faker->randomElement(['available', 'borrowed', 'maintenance']),
            'category_id' => \App\Models\Category::factory(), // Ensure this is valid
        ];
    }
}
