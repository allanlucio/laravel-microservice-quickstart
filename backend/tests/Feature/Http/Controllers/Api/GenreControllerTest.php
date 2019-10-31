<?php

namespace Tests\Feature\Http\Controllers\Api;

use App\Http\Controllers\Api\GenreController;
use App\Http\Resources\GenreResource;
use App\Models\Category;
use App\Models\Genre;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;
use Illuminate\Http\Request;
use Mockery;
use Tests\Exception\TestException;
use Tests\Traits\TestResources;
use Tests\Traits\TestSaves;
use Tests\Traits\TestValidations;

class GenreControllerTest extends TestCase
{
    use DatabaseMigrations, TestValidations, TestSaves, TestResources;
    private $genre;
    private $sendData;
    private $serializedFields = [
        "id","name","is_active","created_at",'updated_at',"deleted_at",
        "categories"=>[
            "*"=>
                ['name',"description","is_active","created_at","updated_at","deleted_at"]
        ]
    ];
    protected function setUp(): void
    {
        parent::setUp();
        $this->genre = factory(Genre::class)->create([
            "is_active"=>false
            ]);
            $this->sendData = [
                "name" => "name",
                "is_active"=>false
            ];

        }
        public function testIndex()
        {
            $category = factory(Category::class)->create();
            $this->genre->categories()->sync($category);
            $response = $this->get(route("genres.index"));

            $response
            ->assertStatus(200);

            $this->assertResourceJsonData($response,['*'=>$this->serializedFields]);
            $this->assertResourcePaginate($response,15);
            $resource = GenreResource::collection(collect([$this->genre]));
            $this->assertResource($response,$resource);
        }

        public function testShow()
        {

            $response = $this->get(route("genres.show",['genre'=>$this->genre->id]));

            $response
            ->assertStatus(200);
            $this->assertModelResource($response);
        }

        public function testInvalidationData(){

            $data = [
                'name' => '',
                "categories_id"=>''
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

        public function testInvalidationArray(){
            $data = [
                "categories_id"=>"a",

            ];
            $this->assertInvalidationInStoreAction($data,"array");
            $this->assertInvalidationInUpdateAction($data,"array");
        }

        public function testInvalidationCategoriesId(){
            $data = [

                "categories_id"=>["a"],

            ];
            $this->assertInvalidationInStoreAction($data,"exists");
            $this->assertInvalidationInUpdateAction($data,"exists");

            $category = factory(Category::class)->create();
            $category->delete();
            $data = [

                "categories_id"=>[$category->id],

            ];
            $this->assertInvalidationInStoreAction($data,"exists");
            $this->assertInvalidationInUpdateAction($data,"exists");


        }

        public function testSave(){
            $category = factory(Category::class)->create();
            $category_array = ["categories_id"=>[$category->id]];
            $data=[
                [
                    "send_data"=>$this->sendData + $category_array,
                    "test_data"=>$this->sendData + ['deleted_at'=>null]
                ],
                [
                    "send_data"=>$this->sendData+['is_active'=>true]+$category_array,
                    "test_data"=>$this->sendData + ['is_active'=>true,'deleted_at'=>null]
                    ]
                ];

                foreach ($data as $key => $value) {
                    $response = $this->assertStore($value["send_data"],$value["test_data"]);
                    $this->assertModelResource($response);
                    $this->assertManyToManyRelashionships($response->json("data.id"),"categories",[$category->id]);

                    $response = $this->assertUpdate($value["send_data"],$value["test_data"]);
                    $this->assertModelResource($response);
                    $this->assertManyToManyRelashionships($response->json("data.id"),"categories",[$category->id]);
                }
            }

            public function testSyncCategories(){
                $categoriesId = factory(Category::class,3)->create()->pluck("id")->toArray();
                $sendData = [
                    "name" => "test",
                    "categories_id"=>[$categoriesId[0]]
                ];
                $response = $this->json("POST", $this->routeStore(),$sendData);
                $this->assertModelResource($response);
                $this->assertDatabaseHas("category_genre",[
                    "category_id"=>$categoriesId[0],
                    "genre_id"=>$response->json("data.id")]
                );

                $sendData = [
                    "name" => "test",
                    "categories_id"=>[$categoriesId[1],$categoriesId[2]]
                ];
                $response = $this->json("PUT",
                route("genres.update",["genre"=>$response->json("data.id")]),
                $sendData

            );
            $this->assertModelResource($response);
            $this->assertDatabaseMissing("category_genre",[
                "category_id"=>$categoriesId[0],
                "genre_id"=>$response->json("data.id")]
            );

            $this->assertDatabaseHas("category_genre",[
                "category_id"=>$categoriesId[1],
                "genre_id"=>$response->json("data.id")]
            );
            $this->assertDatabaseHas("category_genre",[
                "category_id"=>$categoriesId[2],
                "genre_id"=>$response->json("data.id")]
            );

        }

        public function testRollbackStore(){
            $controller = Mockery::mock(GenreController::class)
            ->makePartial()->shouldAllowMockingProtectedMethods();
            $controller->shouldReceive("validate")->withAnyArgs()->andReturn($this->sendData);
            $controller->shouldReceive("rulesStore")->withAnyArgs()->andReturn([]);
            $controller->shouldReceive("handleRelations")->once()->andThrow(new TestException());

            $request = Mockery::mock(Request::class);
            $hasError = false;
            try {
                $controller->store($request);
            } catch (TestException $e) {
                $this->assertCount(1,Genre::all());
                $hasError = true;
            }

            $this->assertTrue($hasError);
        }
        public function testRollbackUpdate(){
            $controller = Mockery::mock(GenreController::class)
            ->makePartial()->shouldAllowMockingProtectedMethods();
            $controller->shouldReceive("validate")->withAnyArgs()->andReturn($this->sendData+["name"=>"teste transaction"]);
            $controller->shouldReceive("rulesUpdate")->withAnyArgs()->andReturn([]);
            $controller->shouldReceive("handleRelations")->once()->andThrow(new TestException());

            $request = Mockery::mock(Request::class);
            $hasError = false;
            try {
                $controller->update($request,$this->genre->id);
            } catch (TestException $e) {
                $this->assertCount(1,Genre::all());
                $this->assertEquals($this->genre->title,Genre::find($this->genre->id)->title);
                $hasError = true;
            }

            $this->assertTrue($hasError);
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
        protected function resource(){
            return GenreResource::class;
        }
    }
