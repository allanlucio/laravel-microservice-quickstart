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

class BaseVideoControllerTest extends TestCase
{
    use DatabaseMigrations;
    protected $video;
    protected $sendData;
    protected function setUp(): void
    {
        parent::setUp();
        $this->video = factory(Video::class)->create([
            "opened"=>false
            ]);


            $this->sendData = [
                "title" => "title",
                "description" => "description",
                "year_launched" => 2010,
                "rating" => Video::RATING_LIST[0],
                "duration" => 90
            ];

        }
}
