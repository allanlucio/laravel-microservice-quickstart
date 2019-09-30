<?php

namespace Tests\Feature\Http\Controllers\Api;

use App\Http\Controllers\Api\VideoController;
use App\Models\Category;
use App\Models\Genre;
use App\Models\Video;
use Exception;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Mockery;
use Tests\Exception\TestException;
use Tests\Traits\TestSaves;
use Tests\Traits\TestValidations;

class VideoControllerTest extends TestCase
{
    use DatabaseMigrations, TestValidations, TestSaves;
    private $video;
    private $sendData;
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
    public function testIndex()
    {

        $response = $this->get(route("videos.index"));

        $response
            ->assertStatus(200)
            ->assertJson([$this->video->toArray()]);
    }

    public function testShow()
    {

        $response = $this->get(route("videos.show",['video'=>$this->video->id]));

        $response
            ->assertStatus(200)
            ->assertJson($this->video->toArray());
    }

    public function testInvalidationRequired(){
        $data = [
            "title"=>"",
            "description"=>"",
            "year_launched"=>"",
            'rating'=>"",
            'duration'=>"",
            'categories_id'=>"",
            'genres_id'=>""
        ];
        $this->assertInvalidationInStoreAction($data,"required");
        $this->assertInvalidationInUpdateAction($data,"required");
    }
    public function testInvalidationMax(){
        $data = [
            "title"=>str_repeat("a",256),

        ];
        $this->assertInvalidationInStoreAction($data,"max.string",["max"=>255]);
        $this->assertInvalidationInUpdateAction($data,"max.string",["max"=>255]);
    }
    public function testInvalidationInteger(){
        $data = [
            "duration"=>"a",

        ];
        $this->assertInvalidationInStoreAction($data,"integer");
        $this->assertInvalidationInUpdateAction($data,"integer");
    }
    public function testInvalidationYearLaunchedField(){
        $data = [
            "year_launched"=>"a",

        ];
        $this->assertInvalidationInStoreAction($data,"date_format",["format"=>"Y"]);
        $this->assertInvalidationInUpdateAction($data,"date_format",["format"=>"Y"]);
    }
    public function testInvalidationOpenedField(){
        $data = [
            "opened"=>"a",

        ];
        $this->assertInvalidationInStoreAction($data,"boolean");
        $this->assertInvalidationInUpdateAction($data,"boolean");
    }
    public function testInvalidationRatingField(){
        $data = [
            "rating"=>"a",

        ];
        $this->assertInvalidationInStoreAction($data,"in");
        $this->assertInvalidationInUpdateAction($data,"in");
    }
    public function testInvalidationArray(){
        $data = [
            "genres_id"=>"a",
            "categories_id"=>"a",

        ];
        $this->assertInvalidationInStoreAction($data,"array");
        $this->assertInvalidationInUpdateAction($data,"array");
    }

    public function testInvalidationCategoriesId(){
        $data = [

            "categories_id"=>["a"],

        ];
        $this->assertInvalidationInStoreAction($data,"exists");
        $this->assertInvalidationInUpdateAction($data,"exists");


        $category = factory(Category::class)->create();
        $category->delete();
        $data = [

            "categories_id"=>[$category->id],

        ];
        $this->assertInvalidationInStoreAction($data,"exists");
        $this->assertInvalidationInUpdateAction($data,"exists");
    }
    public function testInvalidationGenresId(){
        $data = [
            "genres_id"=>["a"],


        ];
        $this->assertInvalidationInStoreAction($data,"exists");
        $this->assertInvalidationInUpdateAction($data,"exists");

        $genre = factory(Genre::class)->create();
        $genre->delete();
        $data = [
            "genres_id"=>[$genre->id],


        ];
        $this->assertInvalidationInStoreAction($data,"exists");
        $this->assertInvalidationInUpdateAction($data,"exists");
    }


    public function testSave(){
        $genre = factory(Genre::class)->create();
        $category = factory(Category::class)->create();
        $genre->categories()->sync($category->id);
        $category_genres_array = ["categories_id"=>[$category->id],"genres_id"=>[$genre->id]];
        $data=[
            [
                "send_data"=>$this->sendData + $category_genres_array,
                "test_data"=>$this->sendData + ['opened'=>false,'deleted_at'=>null]
            ],
            [
                "send_data"=>$this->sendData+['opened'=>true,'duration'=>30,"rating"=>Video::RATING_LIST[1]]+$category_genres_array,
                "test_data"=>$this->sendData + ['opened'=>true,'duration'=>30,"rating"=>Video::RATING_LIST[1],'deleted_at'=>null]
            ]
        ];

        foreach ($data as $key => $value) {
            $response = $this->assertStore($value["send_data"],$value["test_data"]);
            $response->assertJsonStructure(['created_at','updated_at']);
            $this->assertManyToManyRelashionships($response->json("id"),"genres",[$genre->id]);
            $this->assertManyToManyRelashionships($response->json("id"),"categories",[$category->id]);



            $response = $this->assertUpdate($value["send_data"],$value["test_data"]);
            $response->assertJsonStructure(['created_at','updated_at']);
            $this->assertManyToManyRelashionships($response->json("id"),"genres",[$genre->id]);
            $this->assertManyToManyRelashionships($response->json("id"),"categories",[$category->id]);
        }
    }
    public function testSyncGenres(){
        $genres = factory(Genre::class,3)->create();
        $genresId = $genres->pluck("id")->toArray();
        $categoryId = factory(Category::class)->create()->id;

        $genres->each(function($genre) use ($categoryId){
            $genre->categories()->sync($categoryId);
        });


        $response = $this->json("POST", $this->routeStore(),$this->sendData+["categories_id"=>[$categoryId],"genres_id"=>[$genresId[0]]]);
        $this->assertDatabaseHas("genre_video",[
            "genre_id"=>$genresId[0],
            "video_id"=>$response->json("id")
        ]);


        $response = $this->json("PUT",
             route("videos.update",["video"=>$response->json("id")]),
             $this->sendData+[
                 "categories_id"=>[$categoryId],
                 "genres_id"=>[$genresId[1],$genresId[2]]
                 ]
        );
        $this->assertDatabaseMissing("genre_video",[
            "genre_id"=>$genresId[0],
            "video_id"=>$response->json("id")
        ]);

        $this->assertDatabaseHas("genre_video",[
            "genre_id"=>$genresId[1],
            "video_id"=>$response->json("id")
        ]);
        $this->assertDatabaseHas("genre_video",[
            "genre_id"=>$genresId[2],
            "video_id"=>$response->json("id")
        ]);

    }
    public function testSyncCategories(){
        $categoriesId = factory(Category::class,3)->create()->pluck("id")->toArray();
        $genre = factory(Genre::class)->create();
        $genre->categories()->sync($categoriesId);
        $genreId = $genre->id;

        $response = $this->json("POST", $this->routeStore(),$this->sendData+["categories_id"=>[$categoriesId[0]],
        "genres_id"=>[$genreId]]);
        $this->assertDatabaseHas("category_video",[
            "category_id"=>$categoriesId[0],
            "video_id"=>$response->json("id")
        ]);


        $response = $this->json("PUT",
             route("videos.update",["video"=>$response->json("id")]),
             $this->sendData+["categories_id"=>[
                 $categoriesId[1],$categoriesId[2]],
             "genres_id"=>[$genreId]]
        );
        $this->assertDatabaseMissing("category_video",[
            "category_id"=>$categoriesId[0],
            "video_id"=>$response->json("id")
        ]);

        $this->assertDatabaseHas("category_video",[
            "category_id"=>$categoriesId[1],
            "video_id"=>$response->json("id")
        ]);
        $this->assertDatabaseHas("category_video",[
            "category_id"=>$categoriesId[2],
            "video_id"=>$response->json("id")
        ]);

    }


    public function testRollbackStore(){
        $controller = Mockery::mock(VideoController::class)
            ->makePartial()->shouldAllowMockingProtectedMethods();
        $controller->shouldReceive("validate")->withAnyArgs()->andReturn($this->sendData);
        $controller->shouldReceive("rulesStore")->withAnyArgs()->andReturn([]);
        $controller->shouldReceive("handleRelations")->once()->andThrow(new TestException());

        $request = Mockery::mock(Request::class);
        $hasError = false;
        try {
            $controller->store($request);
        } catch (TestException $e) {
            $this->assertCount(1,Video::all());
            $hasError = true;
        }

        $this->assertTrue($hasError);

    }
    public function testRollbackUpdate(){
        $controller = Mockery::mock(VideoController::class)
            ->makePartial()->shouldAllowMockingProtectedMethods();
        $controller->shouldReceive("validate")->withAnyArgs()->andReturn($this->sendData+["title"=>"abcdef"]);
        $controller->shouldReceive("rulesUpdate")->withAnyArgs()->andReturn([]);
        $controller->shouldReceive("handleRelations")->once()->andThrow(new TestException());

        $request = Mockery::mock(Request::class);
        $hasError = false;
        try {
            $controller->update($request,$this->video->id);
        } catch (TestException $e) {
            $this->assertCount(1,Video::all());
            $this->assertEquals($this->video->title,Video::find($this->video->id)->title);
            $hasError = true;
        }

        $this->assertTrue($hasError);
    }

    public function testDelete(){
        $video = factory(Video::class)->create();
        $response = $this->json('delete',route("videos.destroy",['video'=>$video->id]));


        $video = Video::find($video->id);
        $response->assertStatus(204);
        $this->assertNull($video);
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
