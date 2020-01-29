<?php

namespace Tests\Feature\Http\Controllers\Api\VideoController;

use App\Models\CastMember;
use App\Models\Category;
use App\Models\Genre;
use App\Models\Video;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\TestResponse;
use Tests\TestCase;
use Illuminate\Http\UploadedFile;
use Storage;
use Tests\Traits\TestSaves;
use Tests\Traits\TestUploads;
use Tests\Traits\TestValidations;

class BaseVideoControllerTest extends TestCase
{
    use DatabaseMigrations;
    protected $video;
    protected $sendData;
    protected $serializedFields = [
        "title",
        "description",
        "year_launched",
        'opened',
        'rating',
        'duration',
        'video_file',
        "thumb_file",
        "banner_file",
        "trailer_file",
        'video_file_url',
        "thumb_file_url",
        "banner_file_url",
        "trailer_file_url",
        "categories"=>["*"=>["id",'name',"description","is_active"]],
        "genres"=>["*"=>["id",'name',"is_active"]],
        "cast_members"=>["*"=>["id",'name',"type"]],
    ];
    protected function setUp(): void
    {
        parent::setUp();
        $this->video = factory(Video::class)->create([
            "opened"=>false
            ]);
            $genre = factory(Genre::class)->create();
            $category = factory(Category::class)->create();
            $castMember = factory(CastMember::class)->create();
            $genre->categories()->sync($category->id);
            $category_genres_array = ["categories_id"=>[$category->id],"genres_id"=>[$genre->id],'cast_members_id'=>[$castMember->id]];

            $this->sendData = [
                "title" => "title",
                "description" => "description",
                "year_launched" => 2010,
                "rating" => Video::RATING_LIST[0],
                "duration" => 90
            ]+$category_genres_array;

        }
        protected function assertIfFilesUrlExists(Video $video, TestResponse $response){
            $fileFields = Video::$fileFields;
            $data = $response->json("data");
            $data = array_key_exists(0,$data) ? $data[0]: $data;
            foreach($fileFields as $field){
                $file = $video->{$field};
                $relative_path = $video->relativeFilePath($file);
                $file_url = Storage::exists($relative_path)? \Storage::url($relative_path): null;

                $this->assertEquals(
                    $file_url,
                    $data[$field."_url"]
                );
            }
        }
    }


