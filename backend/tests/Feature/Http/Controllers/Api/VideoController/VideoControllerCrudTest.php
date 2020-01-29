<?php

namespace Tests\Feature\Http\Controllers\Api\VideoController;

use App\Http\Resources\VideoResource;
use App\Models\CastMember;
use App\Models\Category;
use App\Models\Genre;
use App\Models\Video;
use Arr;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;
use Illuminate\Http\UploadedFile;
use Storage;
use Tests\Traits\TestResources;
use Tests\Traits\TestSaves;
use Tests\Traits\TestUploads;
use Tests\Traits\TestValidations;

class VideoControllerCrudTest extends BaseVideoControllerTest
{
    use TestValidations, TestSaves, TestResources;

    public function testIndex()
    {
        $this->video->banner_file = "banner_file.png";
        $this->video->save();
        $response = $this->get(route("videos.index"));


        $response
        ->assertStatus(200);

        $this->assertResourceJsonData($response,['*'=>$this->serializedFields]);
        $this->assertResourcePaginate($response,15);
        $resource = VideoResource::collection(collect([$this->video]));
        $this->assertResource($response,$resource);
    }

    public function testShow()
    {

        $response = $this->get(route("videos.show",['video'=>$this->video->id]));

        $response
        ->assertStatus(200);
        $this->assertModelResource($response);

        $this->assertIfFilesUrlExists($this->video,$response);
    }

    public function testInvalidationRequired(){
        $data = [
            "title"=>"",
            "description"=>"",
            "year_launched"=>"",
            'rating'=>"",
            'duration'=>"",
            'categories_id'=>"",
            'genres_id'=>"",
            'cast_members_id'=>"",
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
            "cast_members_id"=>"a",

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
    public function testInvalidationCastMemberId(){
        $data = [
            "cast_members_id"=>["a"],


        ];
        $this->assertInvalidationInStoreAction($data,"exists");
        $this->assertInvalidationInUpdateAction($data,"exists");

        $castMembers = factory(CastMember::class)->create();
        $castMembers->delete();
        $data = [
            "cast_members_id"=>[$castMembers->id],


        ];
        $this->assertInvalidationInStoreAction($data,"exists");
        $this->assertInvalidationInUpdateAction($data,"exists");
    }


    public function testSaveWithoutFiles(){
        $testData = Arr::except($this->sendData,[
            "categories_id","genres_id",'cast_members_id'
        ]);

        $category_id = $this->sendData["categories_id"][0];
        $genre_id = $this->sendData["genres_id"][0];
        $cast_member_id = $this->sendData["cast_members_id"][0];
        $data=[
            [
                "send_data"=>$this->sendData,
                "test_data"=>$testData + ['opened'=>false,'deleted_at'=>null]
            ],
            [
                "send_data"=>$this->sendData+['opened'=>true,'duration'=>30,"rating"=>Video::RATING_LIST[1]],
                "test_data"=>$testData + ['opened'=>true,'duration'=>30,"rating"=>Video::RATING_LIST[1],'deleted_at'=>null]
                ]
            ];

            foreach ($data as $key => $value) {

                $response = $this->assertStore($value["send_data"],$value["test_data"]);
                $this->assertModelResource($response);
                $this->assertManyToManyRelashionships($response->json("data.id"),"genres",[$genre_id]);
                $this->assertManyToManyRelashionships($response->json("data.id"),"categories",[$category_id]);
                $this->assertManyToManyRelashionships($response->json("data.id"),"castMembers",[$cast_member_id]);



                $response = $this->assertUpdate($value["send_data"],$value["test_data"]);
                $this->assertModelResource($response);
                $this->assertManyToManyRelashionships($response->json("data.id"),"genres",[$genre_id]);
                $this->assertManyToManyRelashionships($response->json("data.id"),"categories",[$category_id]);
                $this->assertManyToManyRelashionships($response->json("data.id"),"castMembers",[$cast_member_id]);
            }
        }

        public function testSyncGenres(){
            $genres = factory(Genre::class,3)->create();
            $genresId = $genres->pluck("id")->toArray();
            $categoryId = factory(Category::class)->create()->id;
            $testData = Arr::except($this->sendData,["categories_id","genres_id"]);
            $genres->each(function($genre) use ($categoryId){
                $genre->categories()->sync($categoryId);
            });


            $response = $this->json("POST", $this->routeStore(),$testData+["categories_id"=>[$categoryId],"genres_id"=>[$genresId[0]]]);
            $this->assertDatabaseHas("genre_video",[
                "genre_id"=>$genresId[0],
                "video_id"=>$response->json("data.id")
                ]
            );


            $response = $this->json("PUT",
            route("videos.update",["video"=>$response->json("data.id")]),
            $testData+[
                "categories_id"=>[$categoryId],
                "genres_id"=>[$genresId[1],$genresId[2]]
                ]
            );
            $this->assertModelResource($response);
            $this->assertDatabaseMissing("genre_video",[
                "genre_id"=>$genresId[0],
                "video_id"=>$response->json("data.id")
                ]
            );

            $this->assertDatabaseHas("genre_video",[
                "genre_id"=>$genresId[1],
                "video_id"=>$response->json("data.id")
                ]
            );
            $this->assertDatabaseHas("genre_video",[
                "genre_id"=>$genresId[2],
                "video_id"=>$response->json("data.id")
                ]
            );

        }
        public function testSyncCategories(){
            $testData = Arr::except($this->sendData,["categories_id","genres_id"]);
            $categoriesId = factory(Category::class,3)->create()->pluck("id")->toArray();
            $genre = factory(Genre::class)->create();
            $genre->categories()->sync($categoriesId);
            $genreId = $genre->id;

            $response = $this->json("POST", $this->routeStore(),$testData+["categories_id"=>[$categoriesId[0]],
            "genres_id"=>[$genreId]]);
            $this->assertDatabaseHas("category_video",[
                "category_id"=>$categoriesId[0],
                "video_id"=>$response->json("data.id")]
            );


            $response = $this->json("PUT",
            route("videos.update",["video"=>$response->json("data.id")]),
            $testData+["categories_id"=>[
                $categoriesId[1],$categoriesId[2]],
                "genres_id"=>[$genreId]]
            );
            $this->assertDatabaseMissing("category_video",[
                "category_id"=>$categoriesId[0],
                "video_id"=>$response->json("data.id")
                ]
            );

            $this->assertDatabaseHas("category_video",[
                "category_id"=>$categoriesId[1],
                "video_id"=>$response->json("data.id")
                ]
            );
            $this->assertDatabaseHas("category_video",[
                "category_id"=>$categoriesId[2],
                "video_id"=>$response->json("data.id")
                ]
            );

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
        protected function resource(){
            return VideoResource::class;
        }
    }
