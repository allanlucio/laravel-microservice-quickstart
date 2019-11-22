<?php

namespace Tests\Unit\Models;

use App\Models\Genre;
use App\Models\Traits\Uuid;
use Illuminate\Database\Eloquent\SoftDeletes;
use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class GenreUnitTest extends TestCase
{


    protected function setUp(): void{
        parent::setUp();
        $this->genre = new Genre();
    }

    protected function teardown(): void{
        parent::teardown();

    }



    public function testFillableAttribute()
    {


        $this->assertEquals(
            ["name","is_active"],
            $this->genre->getFillable()
        );

    }
    public function testIncrementAttribute()
    {

        $this->assertFalse( $this->genre->getIncrementing());

    }

    public function testCastsAttribute()
    {
       $casts= ["id" => 'string',"is_active"=>"boolean"];

        $this->assertEquals($casts, $this->genre->getCasts()
        );

    }
    public function testDatesAttribute()
    {

        $dates= array_values(["deleted_at","created_at","updated_at"]);
        $datesGenre= array_values($this->genre->getDates());

        $this->assertEquals($dates,$datesGenre
        );

    }

    public function testIfUseTraits(){


        $traits=[
            SoftDeletes::class, Uuid::class

        ];
        $genreTrais=array_values(class_uses(Genre::class));

        $this->assertEquals($traits,$genreTrais);

    }
}
