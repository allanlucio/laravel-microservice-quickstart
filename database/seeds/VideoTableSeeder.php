<?php

use App\Models\Genre;
use App\Models\Video;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Seeder;
use Illuminate\Http\UploadedFile;

class VideoTableSeeder extends Seeder
{
    private $allGenres;
    private $relations =[
        'genres_id' => [],
        'categories_id' => []
    ];
    /**
    * Run the database seeds.
    *
    * @return void
    */
    public function run()
    {
        $dir = \Storage::getDriver()->getAdapter()->getPathPrefix();
        \File::deleteDirectory($dir,true);
        $this->allGenres = Genre::all();
        $self = $this;
        Model::reguard();
        factory(Video::class,100)
        ->make()
        ->each(function($video) use($self){
            $self->fetchRelations();
            Video::create(
                array_merge(
                    $video->toArray(),
                    [
                        'thumb_file'=>$self->getImageFile(),
                        'banner_file'=>$self->getImageFile(),
                        'trailer_file'=>$self->getVideoFile(),
                        'video_file'=>$self->getVideoFile()
                    ],
                    $this->relations)
                );


            });
            Model::unguard();
        }

        public function fetchRelations(){
            $subGenres = $this->allGenres->random(5)->load("categories");
            $categoriesId = [];
            foreach($subGenres as $genre){

                array_push($categoriesId, ...$genre->categories->pluck("id")->toArray());
            }
            $genresId = $subGenres->pluck('id')->toArray();
            $categoriesId = array_unique($categoriesId);
            $this->relations['categories_id']= $categoriesId;
            $this->relations['genres_id']= $genresId;

        }

        public function getImageFile(){
            return new UploadedFile(
                storage_path('faker/thumbs/laravel Framework.jpeg'),
                'Laravel Framework.png'
            );
        }
        public function getVideoFile(){
            return new UploadedFile(
                storage_path('faker/videos/01- como vai funcionar os uploads.mp4'),
                '01- como vai funcionar os uploads.mp4'
            );
        }

    }
