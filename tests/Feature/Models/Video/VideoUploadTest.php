<?php

namespace Tests\Feature\Models\Video;

use App\Models\Category;
use App\Models\Genre;
use App\Models\Video;
use Illuminate\Database\Events\TransactionCommitted;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Http\UploadedFile;
use Storage;
use Tests\Exception\TestException;

class VideoUploadTest extends BaseVideoTestCase
{
    public function testCreateWithFiles(){
        Storage::fake();
        $video = Video::create(
            $this->data + [
                "thumb_file" => UploadedFile::fake()->image("thumb.jpg"),
                "video_file" => UploadedFile::fake()->image("video.mp4"),
            ]
        );

        Storage::assertExists("{$video->id}/{$video->thumb_file}");
        Storage::assertExists("{$video->id}/{$video->video_file}");

    }
    public function testCreateIfRollbackFiles(){
        Storage::fake();
        \Event::listen(TransactionCommitted::class, function(){
            throw new TestException();
        });
        $hasError = false;

        try {
            $video = Video::create(
                $this->data + [
                    "thumb_file" => UploadedFile::fake()->image("thumb.jpg"),
                    "video_file" => UploadedFile::fake()->image("video.mp4"),
                ]
            );
        } catch (TestException $e) {
            $this->assertCount(0,Storage::allFiles());
            $hasError = true;
        }


        $this->assertTrue($hasError);

    }

}
