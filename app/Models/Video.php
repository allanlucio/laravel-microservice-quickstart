<?php

namespace App\Models;

use App\Models\Traits\Uuid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\DB;

class Video extends Model
{
    use SoftDeletes,Uuid;
    const RATING_LIST = [ "L","10","12","14","16","18"];
    protected $fillable = [
        "title",
        "description",
        "year_launched",
        'opened',
        'rating',
        'duration'
    ];
    protected $dates = ['deleted_at'];
    public $incrementing = false;
    protected $casts = [
        "id" => 'string',
        "year_launched" => 'integer',
        "duration" => 'integer',
        "opened" => 'boolean'
    ] ;

    public static function create(array $attributes){
        try{
            DB::beginTransaction();
            $obj = static::query()->create($attributes);
            DB::commit();

            return $obj;
        }catch(\Exception $e){
            if(isset($obj)){
                //excluir uploads
            }
            DB::rollBack();
            throw $e;
        }

    }

    public function update(array $attributes = [], array $options = []){
        try{
            DB::beginTransaction();
            $saved = parent::update($attributes,$options);
            if($saved){

            }
            DB::commit();

            return $saved;
        }catch(\Exception $e){

            DB::rollBack();
            throw $e;
        }

    }

    public function categories(){
        return $this->belongsToMany(Category::class)->withTrashed();
    }
    public function genres(){
        return $this->belongsToMany(Genre::class)->withTrashed();
    }
}
