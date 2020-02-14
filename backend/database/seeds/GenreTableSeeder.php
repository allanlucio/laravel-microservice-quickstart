<?php

use App\Models\Category;
use App\Models\Genre;
use Illuminate\Database\Seeder;

class GenreTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
            $categories = Category::all();
            factory(Genre::class,6)
                ->create()
                ->each(function($genre) use ($categories){
                    $categoriesId = $categories->random(2)->pluck("id")->toArray();
                    $genre->categories()->attach($categoriesId);
            });

    }
}
