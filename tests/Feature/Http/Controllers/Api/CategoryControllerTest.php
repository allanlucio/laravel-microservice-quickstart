<?php

namespace Tests\Feature\Http\Controllers\Api;

use App\Models\Category;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\TestResponse;
use Tests\Traits\TestSaves;
use Tests\Traits\TestValidations;

class CategoryControllerTest extends TestCase
{
    use DatabaseMigrations, TestValidations, TestSaves;
    private $category;
    protected function setUp(): void
    {
        parent::setUp();

        $this->category = factory(Category::class)->create();
    }

    public function testIndex()
    {
        $response = $this->get(route("categories.index"));
        $response
            ->assertStatus(200)
            ->assertJson([$this->category->toArray()]);
    }

    public function testShow()
    {

        $response = $this->get(route("categories.show",['category'=>$this->category->id]));
        $response
            ->assertStatus(200)
            ->assertJson($this->category->toArray());
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
        $this->assertStore($data,$data + ["description"=>null,'is_active'=>true, 'deleted_at'=>null]);

        $data = [
                "name" => "test2",
                "is_active" => false,
                "description" => 'description'
        ];
        $this->assertStore($data,$data + ["description"=>'description','is_active'=>false, 'deleted_at'=>null]);
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
        $this->assertUpdate($data,$data + ['deleted_at'=>null]);

        $data = [
            "name" => "test",
            "description"=>'',
        ];
        $this->assertUpdate($data,array_merge($data,['description'=>null,'deleted_at'=>null]));

        $data['description']='test';
        $this->assertUpdate($data,array_merge($data,['description'=>'test','deleted_at'=>null]));
        $data['description']=null;
        $this->assertUpdate($data,array_merge($data,['description'=>null,'deleted_at'=>null]));

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
