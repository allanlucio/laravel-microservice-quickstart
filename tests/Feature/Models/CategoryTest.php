<?php

namespace Tests\Feature\Models;

use App\Models\Category;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;

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
        $this->assertRegExp('/^\w{8}\-\w{4}\-\w{4}\-\w{4}\-\w{12}$/',$category->id);


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

    public function testUpdate(){
        $category = $category = factory(Category::class)->create([
            "description" => "test_description",
            "is_active" => false
        ]);

        $data = [
            "name" => 'test_name_update',
            "description" => 'test_description_update',
            "is_active" => true
        ];
        $category->update($data);

        foreach( $data as $key => $value){
            $this->assertEquals($value,$category->{$key});
        }



    }

    public function testDelete(){
        $category = $category = factory(Category::class)->create([
            "description" => "test_description",
            "is_active" => false
        ]);
        $category->delete();

        $category_after_delete = Category::find($category->id);
        $category_on_trash = Category::withTrashed()->find($category->id);
        $this->assertNull($category_after_delete);
        $this->assertNotNull($category_on_trash->updated_at);

        $category_on_trash->forceDelete();
        $category_on_trash_after_force_delete = Category::withTrashed()->find($category->id);
        $this->assertNull($category_on_trash_after_force_delete);
    }
}
