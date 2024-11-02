<?php

namespace Database\Factories;

use App\Models\Borrow;
use App\Models\Book;
use App\Models\User;
use Illuminate\Support\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Borrow>
 */
class BorrowFactory extends Factory
{
    protected $model = Borrow::class;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [ 
            'book_id' => Book::factory(),
            'user_id' => User::factory(),
            'borrow_date' => Carbon::now(),
            'return_date' => Carbon::now()->addDays(rand(1,10)),
        ];
    }
}
