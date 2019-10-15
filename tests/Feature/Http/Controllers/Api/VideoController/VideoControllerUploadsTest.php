<?php

namespace Tests\Feature\Http\Controllers\Api\VideoController;


use App\Models\Category;
use App\Models\Genre;
use App\Models\Video;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;
use Illuminate\Http\UploadedFile;
use Storage;
use Tests\Traits\TestSaves;
use Tests\Traits\TestUploads;
use Tests\Traits\TestValidations;

class VideoControllerUploadsTest extends BaseVideoControllerTest
{
    use TestValidations, TestUploads;

    public function testInvalidationFileVideo(){

        $this->assertInvalidationFile(
            "video_file",
            "mp4",
            12,
            "mimetypes",
            ["values" => "video/mp4"]
        );


    }

    public function testStoreWithFiles(){

        Storage::fake();
        $files = $this->getFiles();
        $genre = factory(Genre::class)->create();
        $category = factory(Category::class)->create();
        $genre->categories()->sync($category->id);

        $category_genres_array = ["categories_id"=>[$category->id],"genres_id"=>[$genre->id]];
        $data=[
            "send_data"=>$this->sendData + $category_genres_array+$files,
            "test_data"=>$this->sendData + ['opened'=>false,'deleted_at'=>null]
        ];

        $response = $this->json("POST",$this->routeStore(),$data["send_data"]);
        $response->assertJsonStructure(['created_at','updated_at']);

        $video_id = $response->json("id");
        foreach($files as $file){
            Storage::assertExists("$video_id/{$file->hashName()}");
        }


    }

    public function testUpdateWithFiles(){

        Storage::fake();
        $files = $this->getFiles();
        $genre = factory(Genre::class)->create();
        $category = factory(Category::class)->create();
        $genre->categories()->sync($category->id);

        $category_genres_array = ["categories_id"=>[$category->id],"genres_id"=>[$genre->id]];
        $data=[
            "send_data"=>$this->sendData + $category_genres_array+$files,
            // "test_data"=>$this->sendData + ['opened'=>false,'deleted_at'=>null]
        ];

        $response = $this->json("PUT",$this->routeUpdate(),$data["send_data"]);
        $response->assertJsonStructure(['created_at','updated_at']);
        $video_id = $response->json("id");
        foreach($files as $file){
            Storage::assertExists($video_id."/".$file->hashName());
        }


    }

    protected function getFiles(){
        return [
            "video_file" => UploadedFile::fake()->create("video_file.mp4")
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
