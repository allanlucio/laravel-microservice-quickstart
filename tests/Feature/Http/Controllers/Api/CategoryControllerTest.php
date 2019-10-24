<?php

namespace Tests\Feature\Http\Controllers\Api;

use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\TestResponse;
use Tests\Traits\TestResources;
use Tests\Traits\TestSaves;
use Tests\Traits\TestValidations;

class CategoryControllerTest extends TestCase
{
    use DatabaseMigrations, TestValidations, TestSaves, TestResources;
    private $category;
    private $serializedFields = [
        "id","name","description","is_active","created_at",'updated_at',"deleted_at"
    ];
    protected function setUp(): void
    {
        parent::setUp();

        $this->category = factory(Category::class)->create();
    }

    public function testIndex()
    {
        $response = $this->get(route("categories.index"));
        $response = $response
        ->assertStatus(200)
        ->assertJsonStructure([
            'data'=>[
                '*'=>$this->serializedFields,

            ],

        ]);

        $this->assertResourcePaginate($response,15);
        $resource = CategoryResource::collection(collect([$this->category]));
        $this->assertResource($response,$resource);

    }

    public function testShow()
    {

        $response = $this->get(route("categories.show",['category'=>$this->category->id]));
        // dd($response->content());


        $response = $response
        ->assertStatus(200)
        ->assertJsonStructure([
            "data"=>$this->serializedFields
        ]);

        $id = $response->json("data.id");
        $resource = new CategoryResource(Category::find($id));
        $this->assertResource($response,$resource);
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
        $response = $this->assertStore($data,$data + ["description"=>null,'is_active'=>true, 'deleted_at'=>null]);
        $response->assertJsonStructure([
            "data"=>$this->serializedFields
            ]);

            $id = $response->json("data.id");
            $resource = new CategoryResource(Category::find($id));
            $this->assertResource($response,$resource);

            $data = [
                "name" => "test2",
                "is_active" => false,
                "description" => 'description'
            ];
            $response = $this->assertStore($data,$data + ["description"=>'description','is_active'=>false, 'deleted_at'=>null]);
            $response->assertJsonStructure([
                "data"=>$this->serializedFields
                ]);

                $id = $response->json("data.id");
                $resource = new CategoryResource(Category::find($id));
                $this->assertResource($response,$resource);


                // $response->assertJson();
            }

            public function testUpdate(){
                $this->category = factory(Category::class)->create([
                    "is_active"=>false,
                    'description'=>"description"
                    ]);

                    $data = [
                        "name" => "test",
                        "description"=>'test',
                        "is_active" => true

                    ];
                    $response = $this->assertUpdate($data,$data + ['deleted_at'=>null]);
                    $response->assertJsonStructure([
                        "data"=>$this->serializedFields
                        ]);
                        $id = $response->json("data.id");
                        $resource = new CategoryResource(Category::find($id));
                        $this->assertResource($response,$resource);

                        $data = [
                            "name" => "test",
                            "description"=>'',
                        ];
                        $response = $this->assertUpdate($data,array_merge($data,['description'=>null,'deleted_at'=>null]));
                        $response->assertJsonStructure([
                            "data"=>$this->serializedFields
                            ]);

                            $data['description']='test';
                            $response = $this->assertUpdate($data,array_merge($data,['description'=>'test','deleted_at'=>null]));
                            $response->assertJsonStructure([
                                "data"=>$this->serializedFields
                                ]);

                                $data['description']=null;
                                $response = $this->assertUpdate($data,array_merge($data,['description'=>null,'deleted_at'=>null]));
                                $response->assertJsonStructure([
                                    "data"=>$this->serializedFields
                                    ]);

                                }

                                public function testDelete(){

                                    $response = $this->json('delete',route("categories.destroy",['category'=>$this->category->id]));
                                    $category = Category::find($this->category->id);
                                    $response->assertStatus(204);
                                    $this->assertNull($category);
                                }


                                protected function routeStore(){
                                    return route('categories.store');
                                }

                                protected function routeUpdate(){
                                    return route('categories.update',['category'=>$this->category->id]);
                                }
                                protected function model(){
                                    return Category::class;
                                }
                            }
