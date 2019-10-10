<?php

namespace Tests\Feature\Models;

use App\Models\Category;
use App\Models\Genre;
use App\Models\Video;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;

class VideoTest extends TestCase
{

    use DatabaseMigrations;
    private $data;

    protected function setUp(): void
    {
        parent::setUp();
        $this->data = [
            "title" => "title",
            "description" => "description",
            "year_launched" => 2010,
            "rating" => Video::RATING_LIST[0],
            "duration" => 90,

        ];
    }
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
            'video_file',
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

    public function testCreateWithRelations(){
        $category = factory(Category::class)->create();
        // dd($category->id);
        $genre = factory(Genre::class)->create();
        $video = Video::create($this->data+
            [
                "categories_id"=>[$category->id],
                "genres_id"=>[$genre->id],
            ]
        );

        $this->assertHasCategory($video->id,$category->id);
        $this->assertHasGenre($video->id,$genre->id);

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

    public function testUpdateWithRelations(){

        $video = factory(Video::class)->create();
        $category = factory(Category::class)->create();
        $genre = factory(Genre::class)->create();
        $video->update($this->data+
            [
                "categories_id"=>[$category->id],
                "genres_id"=>[$genre->id],
            ]
        );

        $this->assertHasCategory($video->id,$category->id);
        $this->assertHasGenre($video->id,$genre->id);

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

    public function testRollbackCreate(){

        $hasError = false;
        try {
            $video = Video::create([
                "title" => "title",
                "description" => "description",
                "year_launched" => 2010,
                "rating" => Video::RATING_LIST[0],
                "duration" => 90,
                'categories_id'=>[0,1,2]
            ]);
        } catch (QueryException $e) {
            $this->assertCount(0,Video::all());
            $hasError = true;
        }

        $this->assertTrue($hasError);

    }
    public function testRollbackUpdate(){
        $hasError = false;
        $video = factory(Video::class)->create();
        $oldTitle = $video->title;
        try {
            $video = $video->update([
                "title" => "title",
                "description" => "description",
                "year_launched" => 2010,
                "rating" => Video::RATING_LIST[0],
                "duration" => 90,
                'categories_id'=>[0,1,2]
            ]);
        } catch (QueryException $e) {
            $this->assertDatabaseHas('videos',[
                'title'=>$oldTitle
            ]);
            $hasError = true;
        }

        $this->assertTrue($hasError);
    }

    protected function assertHasCategory($videoId,$categoryId){
        $this->assertDatabaseHas("category_video",[
            "video_id"=>$videoId,
            "category_id"=>$categoryId
        ]);
    }

    protected function assertHasGenre($videoId,$genreId){
        $this->assertDatabaseHas("genre_video",[
            "video_id"=>$videoId,
            "genre_id"=>$genreId
        ]);
    }

    public function testHandleRelations(){
        $video = factory(Video::class)->create();
        Video::handleRelations($video,[]);
        $this->assertCount(0,$video->categories);
        $this->assertCount(0,$video->genres);

        $category = factory(Category::class)->create();
        Video::handleRelations($video, [
            "categories_id"=>[$category->id]
        ]);
        $video->refresh();
        $this->assertCount(1,$video->categories);

        $genre = factory(Genre::class)->create();
        Video::handleRelations($video, [
            "genres_id"=>[$genre->id]
        ]);
        $video->refresh();
        $this->assertCount(1,$video->genres);

        $video->categories()->delete();
        $video->genres()->delete();

        Video::handleRelations($video, [
            "genres_id"=>[$genre->id],
            "categories_id"=>[$category->id]
        ]);
        $video->refresh();
        $this->assertCount(1,$video->genres);
        $this->assertCount(1,$video->categories);

    }
    public function testSyncCategories(){
        $video = factory(Video::class)->create();
        $categoriesId = factory(Category::class,3)->create()->pluck("id")->toArray();
        Video::handleRelations($video,[
            'categories_id' => [$categoriesId[0]]
        ]);

        $this->assertDatabaseHas("category_video",[
            "category_id"=>$categoriesId[0],
            "video_id"=>$video->id
        ]);

        Video::handleRelations($video,[
            'categories_id' => [$categoriesId[1],$categoriesId[2]]
        ]);

        $this->assertDatabaseMissing("category_video",[
            "category_id"=>$categoriesId[0],
            "video_id"=>$video->id
        ]);
        $this->assertDatabaseHas("category_video",[
            "category_id"=>$categoriesId[1],
            "video_id"=>$video->id
        ]);
        $this->assertDatabaseHas("category_video",[
            "category_id"=>$categoriesId[2],
            "video_id"=>$video->id
        ]);

    }
    public function testSyncGenres(){
        $video = factory(Video::class)->create();
        $genresId = factory(Genre::class,3)->create()->pluck("id")->toArray();
        Video::handleRelations($video,[
            'genres_id' => [$genresId[0]]
        ]);

        $this->assertDatabaseHas("genre_video",[
            "genre_id"=>$genresId[0],
            "video_id"=>$video->id
        ]);

        Video::handleRelations($video,[
            'genres_id' => [$genresId[1],$genresId[2]]
        ]);

        $this->assertDatabaseMissing("genre_video",[
            "genre_id"=>$genresId[0],
            "video_id"=>$video->id
        ]);
        $this->assertDatabaseHas("genre_video",[
            "genre_id"=>$genresId[1],
            "video_id"=>$video->id
        ]);
        $this->assertDatabaseHas("genre_video",[
            "genre_id"=>$genresId[2],
            "video_id"=>$video->id
        ]);

    }
}
