<?php

namespace Tests\Unit\Models\Video;

use App\Models\Traits\UploadFiles;
use App\Models\Video;
use App\Models\Traits\Uuid;
use Illuminate\Database\Eloquent\SoftDeletes;
use Tests\TestCase;

class VideoUnitTest extends TestCase
{


    protected function setUp(): void{
        parent::setUp();
        $this->video = new Video();
    }

    protected function teardown(): void{
        parent::teardown();

    }



    public function testFillableAttribute()
    {


        $this->assertEquals(
            [
                "title",
                "description",
                "year_launched",
                'opened',
                'rating',
                'duration',
                'video_file',
                "thumb_file",
                "banner_file",
                "trailer_file"

            ],
            $this->video->getFillable()
        );

    }
    public function testIncrementAttribute()
    {

        $this->assertFalse( $this->video->getIncrementing());

    }

    public function testCastsAttribute()
    {
        $casts= [
            "id" => 'string',
            "year_launched" => 'integer',
            "duration" => 'integer',
            "opened" => 'boolean'
        ];

        $this->assertEquals($casts, $this->video->getCasts()
    );

}
public function testDatesAttribute()
{

    $dates= array_values(["deleted_at","created_at","updated_at"]);
    $datesVideo= array_values($this->video->getDates());

    $this->assertEquals($dates,$datesVideo
);

}

public function testIfUseTraits(){


    $traits=[
        SoftDeletes::class, Uuid::class, UploadFiles::class

    ];
    $videoTrais=array_values(class_uses(Video::class));

    $this->assertEquals($traits,$videoTrais);

}
}
