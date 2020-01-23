<?php

namespace Tests\Unit\Models;

use App\Models\CastMember;
use App\Models\Traits\Uuid;
use EloquentFilter\Filterable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class CastMemberUnitTest extends TestCase
{


    protected function setUp(): void{
        parent::setUp();
        $this->cast_member = new CastMember();
    }

    protected function teardown(): void{
        parent::teardown();

    }

    public function testFillableAttribute()
    {


        $this->assertEquals(
            ["name","type"],
            $this->cast_member->getFillable()
        );

    }
    public function testIncrementAttribute()
    {

        $this->assertFalse( $this->cast_member->getIncrementing());

    }

    public function testCastsAttribute()
    {
       $casts= ["id" => 'string',"type"=>"int"];

        $this->assertEquals($casts, $this->cast_member->getCasts()
        );

    }
    public function testDatesAttribute()
    {

        $dates= array_values(["deleted_at","created_at","updated_at"]);
        $datesCastMember= array_values($this->cast_member->getDates());

        $this->assertEquals($dates,$datesCastMember
        );

    }

    public function testIfUseTraits(){


        $traits=[
            SoftDeletes::class, Uuid::class, Filterable::class

        ];
        $cast_memberTrais=array_values(class_uses(CastMember::class));

        $this->assertEqualsCanonicalizing($traits,$cast_memberTrais);

    }
}
