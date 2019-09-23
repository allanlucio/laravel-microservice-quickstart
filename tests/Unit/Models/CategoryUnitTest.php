<?php

namespace Tests\Unit\Models;

use App\Models\Category;
use App\Models\Traits\Uuid;
use Illuminate\Database\Eloquent\SoftDeletes;
use Tests\TestCase;

class CategoryUnitTest extends TestCase
{


    protected function setUp(): void{
        parent::setUp();
        $this->category = new Category();
    }

    protected function teardown(): void{
        parent::teardown();

    }



    public function testFillableAttribute()
    {


        $this->assertEquals(
            ["name","description","is_active"],
            $this->category->getFillable()
        );

    }
    public function testIncrementAttribute()
    {

        $this->assertFalse( $this->category->getIncrementing());

    }

    public function testCastsAttribute()
    {
       $casts= ["id" => 'string',"is_active"=>"boolean"];

        $this->assertEquals($casts, $this->category->getCasts()
        );

    }
    public function testDatesAttribute()
    {

        $dates= array_values(["deleted_at","created_at","updated_at"]);
        $datesCategory= array_values($this->category->getDates());

        $this->assertEquals($dates,$datesCategory
        );

    }

    public function testIfUseTraits(){


        $traits=[
            SoftDeletes::class, Uuid::class

        ];
        $categoryTrais=array_values(class_uses(Category::class));

        $this->assertEquals($traits,$categoryTrais);

    }
}
