<?php

use App\Models\CastMember;
use Illuminate\Database\Seeder;

class CastMembersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::transaction(function () {
            factory(CastMember::class,100)->create();
        });
    }
}
