<?php

namespace Tests\Feature\Models;

use App\Models\Category;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class CategoryTest extends TestCase
{

    use DatabaseMigrations;
    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function testList()
    {
        $category=factory(Category::class)->create();
        $categories = Category::all();
        $this->assertCount(1, $categories);

        $categoryKeys = array_keys($categories->first()->getAttributes());

        $keys = [
            "id",
            "name",
            "description",
            "is_active",
            "deleted_at",
            "created_at",
            "updated_at"
        ];
        $this->assertEqualsCanonicalizing($keys,$categoryKeys);
    }

    public function testCreate(){
        $category = Category::create(
            ["name"=>"test1"]
        );
        $category->refresh();

        $this->assertEquals("test1",$category->name);
        $this->assertNull($category->description);
        $this->assertTrue((bool)$category->is_active);

        $category = Category::create(
            ["name"=>"test1",
             "description"=>null
            ]
        );
        $this->assertNull($category->description);

        $category = Category::create(
            ["name"=>"test1",
             "description"=>"ola"
            ]
        );
        $category->refresh();
        $this->assertEquals("ola",$category->description);


        $category = Category::create(
            ["name"=>"test1",
             "is_active"=>false
            ]
        );
        $category->refresh();
        $this->assertFalse($category->is_active);

    }

    public function testCreate(){
        $category = factory(Category::class);
        $category->refresh();

        $this->assertEquals("test1",$category->name);
        $this->assertNull($category->description);
        $this->assertTrue((bool)$category->is_active);

        $category = Category::create(
            ["name"=>"test1",
             "description"=>null
            ]
        );
        $this->assertNull($category->description);

        $category = Category::create(
            ["name"=>"test1",
             "description"=>"ola"
            ]
        );
        $category->refresh();
        $this->assertEquals("ola",$category->description);


        $category = Category::create(
            ["name"=>"test1",
             "is_active"=>false
            ]
        );
        $category->refresh();
        $this->assertFalse($category->is_active);

    }
}
