<?php

use App\Models\Category;
use Illuminate\Database\Seeder;
use DB;
class CategoriesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::transaction(function () {
            factory(Category::class,100)->create();
        });

    }
}
