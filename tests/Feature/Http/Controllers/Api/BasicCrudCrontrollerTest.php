<?php

namespace Tests\Feature\Http\Controllers\Api;


use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\TestResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Tests\Stubs\Controllers\CategoryControllerStub;
use Tests\Stubs\Models\CategoryStub;

class BasicCrudCrontrollerTest extends TestCase
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


        $result = $this->controller->index()->toArray();
        $this->assertEquals([$category->toArray()], $result);
    }


    public function testInvalidationDataInStore(){

        $request = \Mockery::mock(Request::class);
        $request->shouldReceive("all")->once()->andReturn(['name'=>'']);
        $this->expectException(ValidationException::class);
        $this->controller->store($request);

    }

}
