<?php

namespace Tests\Feature\Models;

use App\Models\Genre;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class GenreTest extends TestCase
{
    use DatabaseMigrations;
    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function testList()
    {
        $genre=factory(Genre::class)->create();
        $genres = Genre::all();
        $this->assertCount(1, $genres);

        $genreKeys = array_keys($genres->first()->getAttributes());

        $keys = [
            "id",
            "name",
            "is_active",
            "deleted_at",
            "created_at",
            "updated_at"
        ];
        $this->assertEqualsCanonicalizing($keys,$genreKeys);
    }

    public function testCreate(){
        $genre = Genre::create(
            ["name"=>"test1"]
        );
        $genre->refresh();

        $this->assertEquals("test1",$genre->name);
        $this->assertNull($genre->description);
        $this->assertTrue((bool)$genre->is_active);
        $this->assertRegExp('/^\w{8}\-\w{4}\-\w{4}\-\w{4}\-\w{12}$/',$genre->id);

        $genre = Genre::create(
            ["name"=>"test1",
             "is_active"=>false
            ]
        );
        $genre->refresh();
        $this->assertFalse($genre->is_active);

    }

    public function testUpdate(){
        $genre = $genre = factory(Genre::class)->create([
            "is_active" => false
        ]);

        $data = [
            "name" => 'test_name_update',
            "is_active" => true
        ];
        $genre->update($data);

        foreach( $data as $key => $value){
            $this->assertEquals($value,$genre->{$key});
        }



    }

    public function testDelete(){
        $genre = $genre = factory(Genre::class)->create();
        $genre->delete();

        $genre_after_delete = Genre::find($genre->id);
        $genre_on_trash = Genre::withTrashed()->find($genre->id);
        $this->assertNull($genre_after_delete);
        $this->assertNotNull($genre_on_trash->updated_at);

        $genre_on_trash->forceDelete();
        $genre_on_trash_after_force_delete = Genre::withTrashed()->find($genre->id);
        $this->assertNull($genre_on_trash_after_force_delete);
    }
}
