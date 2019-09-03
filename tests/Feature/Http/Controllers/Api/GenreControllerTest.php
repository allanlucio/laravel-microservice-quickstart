<?php

namespace Tests\Feature\Http\Controllers\Api;

use App\Models\Genre;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\TestResponse;

class GenreControllerTest extends TestCase
{
    use DatabaseMigrations;

    public function testIndex()
    {
        $genre = factory(Genre::class)->create();
        $response = $this->get(route("genres.index"));

        $response
            ->assertStatus(200)
            ->assertJson([$genre->toArray()]);
    }

    public function testShow()
    {
        $genre = factory(Genre::class)->create();
        $response = $this->get(route("genres.show",['genre'=>$genre->id]));

        $response
            ->assertStatus(200)
            ->assertJson($genre->toArray());
    }

    public function testInvalidationData(){
        $response = $this->json('post',route("genres.store"),[]);

        $this->assertInvalidationRequired($response);

        $response = $this->json('post',route("genres.store"),
            [
                "name"=>str_repeat("a",256),
                "is_active"=>"a"
        ]);
        $this->assertInvalidationMax($response);
        $this->assertInvalidationBoolean($response);


        $genre = factory(Genre::class)->create();
        $response = $this->json('put',route("genres.update",
            [
                "genre"=>$genre->id
            ]),
            []
        );
        $this->assertInvalidationRequired($response);

        $response = $this->json('put',route("genres.update",[
            "genre"=>$genre->id
            ]),
            [
                "name"=>str_repeat("a",256),
                "is_active"=>"a"
            ]);
        $this->assertInvalidationMax($response);
        $this->assertInvalidationBoolean($response);

    }

    public function assertInvalidationRequired(TestResponse $response){
        $response
            ->assertStatus(422)
            ->assertJsonValidationErrors(['name'])
            ->assertJsonMissingValidationErrors(["is_active"])
            ->assertJsonFragment([
                \Lang::trans("validation.required",["attribute"=>"name"])
            ]);
    }

    public function assertInvalidationMax(TestResponse $response){
        $response
            ->assertStatus(422)
            ->assertJsonValidationErrors(['name'])
            ->assertJsonFragment([
                \Lang::trans("validation.max.string",["attribute"=>"name","max"=>255])
            ]);

    }
    public function assertInvalidationBoolean(TestResponse $response){
        $response
            ->assertStatus(422)
            ->assertJsonValidationErrors(['is_active'])
            ->assertJsonFragment([
                \Lang::trans("validation.boolean",["attribute"=>"is active"])
            ]);
    }

    public function testStore(){
        $response = $this->json('post',route("genres.store"),[
            "name" => "test"
        ]);

        $id = $response->json("id");
        $genre = Genre::find($id);

        $response
            ->assertStatus(201)
            ->assertJson($genre->toArray());

        $this->assertTrue($response->json("is_active"));

        $response = $this->json('post',route("genres.store"),[
            "name" => "test2",
            "is_active" => false
        ]);

        $id = $response->json("id");
        $genre = Genre::find($id);

        $response
            ->assertStatus(201)
            ->assertJson($genre->toArray());

        $this->assertFalse($response->json("is_active"));
    }

    public function testUpdate(){
        $genre = factory(Genre::class)->create([
            "is_active"=>false,
        ]);
        $response = $this->json('put',route("genres.update",['genre'=>$genre->id]),[
            "name" => "test",
            "is_active" => true

        ]);

        $id = $response->json("id");
        $genre = Genre::find($id);

        $response
            ->assertStatus(200)
            ->assertJson($genre->toArray())
            ->assertJsonFragment([
                'is_active'=>true
            ]);

    }

    public function testDelete(){
        $genre = factory(Genre::class)->create();
        $response = $this->json('delete',route("genres.destroy",['genre'=>$genre->id]));


        $genre = Genre::find($genre->id);
        $response->assertStatus(204);
        $this->assertNull($genre);



    }
}
