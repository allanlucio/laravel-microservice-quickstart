<?php

namespace Tests\Feature\Http\Controllers\Api;

use App\Http\Controllers\Api\BasicCrudController;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\TestResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Tests\Stubs\Controllers\CategoryControllerStub;
use Tests\Stubs\Models\CategoryStub;
use Tests\Stubs\Resources\CategoryResourceStub;
use Tests\Traits\TestResources;

class BasicCrudControllerTest extends TestCase
{
    private $controller;

    protected function setUp(): void
    {
        parent::setUp();
        CategoryStub::dropTable();
        CategoryStub::createTable();

        $this->controller = new CategoryControllerStub();
    }

    protected function tearDown(): void
    {
        CategoryStub::dropTable();
        parent::tearDown();

    }

    public function testIndex(){
        $category = CategoryStub::create([
            "name"=>'test_name',
            "description" => "test_description"
        ]);


        $resource_response = $this->controller->index();
        $resource_data_response = $resource_response->response()->getData(true);
        $resource = CategoryResourceStub::collection(CategoryStub::paginate(15));
        $data = $resource->response()->getData(true);

        $this->assertEquals($resource_data_response, $data);
        $this->assertArrayHasKey('meta',$resource_data_response);
        $this->assertArrayHasKey('links',$resource_data_response);
    }


    public function testInvalidationDataInStore(){

        $request = \Mockery::mock(Request::class);
        $request->shouldReceive("all")->once()->andReturn(['name'=>'']);
        $this->expectException(ValidationException::class);
        $this->controller->store($request);

    }

    public function testStore(){
        $request = \Mockery::mock(Request::class);
        $request->shouldReceive("all")->once()->andReturn(['name'=>'test_name','description'=>'description']);
        $obj = $this->controller->store($request);
        $resource = new CategoryResourceStub(CategoryStub::find(1));
        $data = $resource->response()->getData(true);

        $this->assertEquals(
            $obj->response()->getData(true),
            $data
        );
    }

    public function testUpdate(){
        $category = CategoryStub::create([
            "name"=>'test_name',
            "description" => "test_description"
        ]);

        $request = \Mockery::mock(Request::class);

        $data=['name'=>'test_name2','description'=>'description2','id'=>$category->id];
        $request->shouldReceive("all")->once()->andReturn($data);
        $obj = $this->controller->update($request, $category->id);
        $resource = new CategoryResourceStub(CategoryStub::find(1));
        $data = $resource->response()->getData(true);

        $this->assertEquals(
            $obj->response()->getData(true),
            $data
        );
    }

    public function testShow(){
        $category = CategoryStub::create([
            "name"=>'test_name',
            "description" => "test_description"
        ]);
        $obj = $this->controller->show($category->id);
        $resource = new CategoryResourceStub(CategoryStub::find(1));
        $data = $resource->response()->getData(true);

        $this->assertEquals(
            $obj->response()->getData(true),
            $data
        );
    }

    public function testDestroy(){
        $category = CategoryStub::create([
            "name"=>'test_name',
            "description" => "test_description"
        ]);

        $response = $this->controller->destroy($category->id);
        $this->assertNull(CategoryStub::find($category->id));
        $this->createTestResponse($response)->assertStatus(204);
    }

    public function testIfFindOrFailFetchModel(){
        $category = CategoryStub::create([
            "name"=>'test_name',
            "description" => "test_description"
        ]);

        $reflectionClass = new \ReflectionClass(BasicCrudController::class);
        $reflectionMethod = $reflectionClass->getMethod('findOrFail');
        $reflectionMethod->setAccessible(true);

        $result = $reflectionMethod->invokeArgs($this->controller, [$category->id]);
        $this->assertInstanceOf(CategoryStub::class, $result);
    }
    public function testIfFinfOrFailThrowExceptionWhenIdFailed(){

        $reflectionClass = new \ReflectionClass(BasicCrudController::class);
        $reflectionMethod = $reflectionClass->getMethod('findOrFail');
        $reflectionMethod->setAccessible(true);
        $this->expectException(ModelNotFoundException::class);
        $reflectionMethod->invokeArgs($this->controller, [0]);

    }



}
