<?php

use App\Models\Video;
use Illuminate\Database\Seeder;

class VideoTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::transaction(function () {
            factory(Video::class,100)->create();
        });
    }
}
