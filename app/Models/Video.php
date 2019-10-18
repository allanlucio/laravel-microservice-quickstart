<?php

namespace App\Models;

use App\Models\Traits\UploadFiles;
use App\Models\Traits\Uuid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\DB;

class Video extends Model
{
    use SoftDeletes,Uuid,UploadFiles;
    const RATING_LIST = [ "L","10","12","14","16","18"];
    public static $fileFields = ['video_file',"thumb_file","banner_file","trailer_file"];

    protected $fillable = [
        "title",
        "description",
        "year_launched",
        'opened',
        'rating',
        'duration',
        'video_file',
        "thumb_file",
        "banner_file",
        "trailer_file"
    ];
    // protected $appends = ["video_file_url",];

    protected $dates = ['deleted_at'];
    public $incrementing = false;
    protected $casts = [
        "id" => 'string',
        "year_launched" => 'integer',
        "duration" => 'integer',
        "opened" => 'boolean'
    ];

    public function getVideoFileUrlAttribute(){
        return $this->getFileUrl($this->video_file);
    }
    public function getThumbFileUrlAttribute(){
        return $this->getFileUrl($this->thumb_file);
    }
    public function getBannerFileUrlAttribute(){
        return $this->getFileUrl($this->banner_file);
    }
    public function getTrailerFileUrlAttribute(){
        return $this->getFileUrl($this->trailer_file);
    }

    public static function create(array $attributes){
        $files = self::extracFiles($attributes);
        try{
            DB::beginTransaction();
            $obj = static::query()->create($attributes);

            static::handleRelations($obj,$attributes);
            $obj->uploadFiles($files);
            DB::commit();

            return $obj;
        }catch(\Exception $e){
            if(isset($obj)){
                $obj->deleteFiles($files);
            }
            DB::rollBack();
            throw $e;
        }

    }

    public function update(array $attributes = [], array $options = []){
        $files = self::extracFiles($attributes);
        try{
            DB::beginTransaction();
            $saved = parent::update($attributes,$options);
            static::handleRelations($this,$attributes);
            if($saved){
                $this->uploadFiles($files);
            }

            DB::commit();

            if($saved && count($files)){
                $this->deleteOldFiles();
            }
            return $saved;
        }catch(\Exception $e){
            $this->deleteFiles($files);
            DB::rollBack();
            throw $e;
        }

    }

    public static function handleRelations($video, $attributes){
        if(key_exists("categories_id",$attributes)){

            $video->categories()->sync($attributes["categories_id"]);
        }
        if(key_exists("genres_id",$attributes)){
            $video->genres()->sync($attributes["genres_id"]);
        }



    }

    public function categories(){
        return $this->belongsToMany(Category::class)->withTrashed();
    }
    public function genres(){
        return $this->belongsToMany(Genre::class)->withTrashed();
    }

    protected function uploadDir()
    {
        return $this->id;
    }
}
