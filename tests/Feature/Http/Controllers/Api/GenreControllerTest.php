<?php

namespace Tests\Feature\Http\Controllers\Api;

use App\Models\Genre;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\TestResponse;
use Tests\Traits\TestSaves;
use Tests\Traits\TestValidations;

class GenreControllerTest extends TestCase
{
    use DatabaseMigrations, TestValidations, TestSaves;
    private $genre;
    protected function setUp(): void
    {
        parent::setUp();
        $this->genre = factory(Genre::class)->create();

    }
    public function testIndex()
    {

        $response = $this->get(route("genres.index"));

        $response
            ->assertStatus(200)
            ->assertJson([$this->genre->toArray()]);
    }

    public function testShow()
    {

        $response = $this->get(route("genres.show",['genre'=>$this->genre->id]));

        $response
            ->assertStatus(200)
            ->assertJson($this->genre->toArray());
    }

    public function testInvalidationData(){

        $data = [
            'name' => ''
        ];
        $this->assertInvalidationInStoreAction($data,'required');
        $this->assertInvalidationInUpdateAction($data,'required');

        $data = [
            "name"=>str_repeat("a",256)
        ];

        $this->assertInvalidationInStoreAction($data,'max.string',["max"=>255]);
        $this->assertInvalidationInUpdateAction($data,'max.string',["max"=>255]);

        $data = [
            "is_active"=>"a"
        ];
        $this->assertInvalidationInStoreAction($data,'boolean');
        $this->assertInvalidationInUpdateAction($data,'boolean');


    }


    public function testStore(){
        $data = [
            "name" => "test"
        ];
        $this->assertStore($data,$data + ['is_active'=>true, 'deleted_at'=>null]);

        $data = [
                "name" => "test2",
                "is_active" => false,

        ];
        $this->assertStore($data,$data + ['is_active'=>false, 'deleted_at'=>null]);
    }

    public function testUpdate(){
        $this->genre = factory(Genre::class)->create([
            "is_active"=>false,

        ]);

        $data = [
            "name" => "test",
            "is_active" => true

        ];
        $this->assertUpdate($data,$data + ['deleted_at'=>null]);

        $data = [
            "name" => "test",
        ];
        $this->assertUpdate($data,array_merge($data,['deleted_at'=>null]));

    }

    public function testDelete(){
        $genre = factory(Genre::class)->create();
        $response = $this->json('delete',route("genres.destroy",['genre'=>$genre->id]));


        $genre = Genre::find($genre->id);
        $response->assertStatus(204);
        $this->assertNull($genre);
    }

    protected function routeStore(){
        return route('genres.store');
    }

    protected function routeUpdate(){
        return route('genres.update',['genre'=>$this->genre->id]);
    }
    protected function model(){
        return Genre::class;
    }
}
