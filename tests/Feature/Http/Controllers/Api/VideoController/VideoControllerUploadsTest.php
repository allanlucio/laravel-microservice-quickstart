<?php

namespace Tests\Feature\Http\Controllers\Api\VideoController;


use App\Models\Category;
use App\Models\Genre;
use App\Models\Video;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\TestResponse;
use Tests\TestCase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Arr;
use Storage;
use Tests\Traits\TestSaves;
use Tests\Traits\TestUploads;
use Tests\Traits\TestValidations;

class VideoControllerUploadsTest extends BaseVideoControllerTest
{
    use TestValidations, TestUploads;

    public function testInvalidationFilesVideo(){

        $this->assertInvalidationFile(
            "video_file",
            "mp4",
            Video::VIDEO_FILE_MAX_SIZE,
            "mimetypes",
            ["values" => "video/mp4"]
        );

        $this->assertInvalidationFile(
            "trailer_file",
            "mp4",
            Video::TRAILER_FILE_MAX_SIZE,
            "mimetypes",
            ["values" => "video/mp4"]
        );

        $this->assertInvalidationFile(
            "thumb_file",
            "jpg",
            Video::THUMB_FILE_MAX_SIZE,
            "image"

        );

        $this->assertInvalidationFile(
            "banner_file",
            "jpg",
            Video::BANNER_FILE_MAX_SIZE,
            "image"

        );


    }

    public function testStoreWithFiles(){

        Storage::fake();
        $files = $this->getFiles();
        $data=[
            "send_data"=>$this->sendData +$files,
            "test_data"=>$this->sendData + ['opened'=>false,'deleted_at'=>null]
        ];

        $response = $this->json("POST",$this->routeStore(),$data["send_data"]);

        $response->assertJsonStructure(['created_at','updated_at']);
        $response->assertStatus(201);

        $video_id = $response->json("id");
        $this->assertFilesOnPersist($response,$files);


    }

    public function testUpdateWithFiles(){

        Storage::fake();
        $files = $this->getFiles();


        $data=[
            "send_data"=>$this->sendData + $files,
        ];

        $response = $this->json("PUT",$this->routeUpdate(),$data["send_data"]);
        $response->assertJsonStructure(['created_at','updated_at']);

        $response->assertStatus(200);
        $this->assertFilesOnPersist($response,$files);

        $newFiles = [
            "video_file" => UploadedFile::fake()->create("video_file.mp4"),
            "thumb_file" => UploadedFile::fake()->create("thumb_file.jpeg"),
        ];
        $response = $this->json("PUT",$this->routeUpdate(),$this->sendData + $newFiles);

        $response->assertStatus(200);
        $this->assertFilesOnPersist($response,Arr::except($files,['thumb_file','video_file']) + $newFiles);

        $id = $response->json('id');
        $video = Video::find($id);
        \Storage::assertMissing($video->relativeFilePath($files['thumb_file']->hashName()));
        \Storage::assertMissing($video->relativeFilePath($files['video_file']->hashName()));



    }

    protected function assertFilesOnPersist(TestResponse $response, $files){
        $id = $response->json('id');
        $video = Video::find($id);
        $this->assertFilesExistsInStorage($video,$files);
    }

    protected function getFiles(){
        return [
            "video_file" => UploadedFile::fake()->create("video_file.mp4"),
            "thumb_file" => UploadedFile::fake()->create("thumb_file.jpeg"),
            "banner_file" => UploadedFile::fake()->image("banner_file.jpeg"),
            "trailer_file" => UploadedFile::fake()->image("trailer_file.mp4"),
        ];
    }


    protected function routeStore(){
        return route('videos.store');
    }

    protected function routeUpdate(){
        return route('videos.update',['video'=>$this->video->id]);
    }
    protected function model(){
        return Video::class;
    }
}
