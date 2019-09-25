<?php

namespace Tests\Feature\Models;

use App\Models\Video;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;

class VideoTest extends TestCase
{

    use DatabaseMigrations;
    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function testList()
    {
        $video=factory(Video::class)->create();
        $videos = Video::all();
        $this->assertCount(1, $videos);

        $videoKeys = array_keys($videos->first()->getAttributes());

        $keys = [
            "id",
            "title",
            "description",
            "year_launched",
            'opened',
            'rating',
            'duration',
            "deleted_at",
            "created_at",
            "updated_at"
        ];
        $this->assertEqualsCanonicalizing($keys,$videoKeys);
    }

    public function testCreate(){
        $video = Video::create(
            ["title"=>"test",
            "description"=>"description",
            "year_launched"=>2008,
            'rating'=>"L",
            'duration'=>190]
        );
        $video->refresh();

        $this->assertEquals("test",$video->title);
        $this->assertEquals("description",$video->description);
        $this->assertEquals(2008,$video->year_launched);
        $this->assertEquals("L",$video->rating);
        $this->assertEquals(190,$video->duration);
        $this->assertFalse($video->opened);
        $this->assertRegExp('/^\w{8}\-\w{4}\-\w{4}\-\w{4}\-\w{12}$/',$video->id);


        $video = Video::create(
            ["title"=>"test",
            "description"=>"description",
            "year_launched"=>2008,
            'rating'=>"L",
            "opened"=>true,
            'duration'=>190]
        );
        $video->refresh();
        $this->assertTrue($video->opened);



    }

    public function testUpdate(){
        $video = $video = factory(Video::class)->create();

        $data = [
            "title"=>"test custom",
            "description"=>"description custom",
            "year_launched"=>2020,
            'rating'=>"14",
            "opened"=>true,
            'duration'=>350
        ];
        $video->update($data);

        foreach( $data as $key => $value){
            $this->assertEquals($value,$video->{$key});
        }



    }

    public function testDelete(){
        $video = $video = factory(Video::class)->create([
            "description" => "test_description",
        ]);
        $video->delete();

        $video_after_delete = Video::find($video->id);
        $video_on_trash = Video::withTrashed()->find($video->id);
        $this->assertNull($video_after_delete);
        $this->assertNotNull($video_on_trash->updated_at);

        $video_on_trash->forceDelete();
        $video_on_trash_after_force_delete = Video::withTrashed()->find($video->id);
        $this->assertNull($video_on_trash_after_force_delete);
    }
}
