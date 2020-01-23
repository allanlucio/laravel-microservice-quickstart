<?php

namespace App\Models;

use App\ModelFilters\GenreFilter;
use App\Models\Traits\Uuid;
use EloquentFilter\Filterable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Genre extends Model
{
    use SoftDeletes,Filterable;
    use Uuid;
    protected $fillable = ["name","is_active"];
    protected $dates = ['deleted_at'];
    public $incrementing = false;
    protected $casts = [
        "id" => 'string',
        "is_active" => 'boolean'
    ] ;

    public function categories(){
        return $this->belongsToMany(Category::class)->withTrashed();
    }
    public function modelFilter(){
        return $this->provideFilter(GenreFilter::class);
    }

}
