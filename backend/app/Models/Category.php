<?php

namespace App\Models;

use App\ModelFilters\CategoryFilter;
use App\Models\Traits\Uuid;
use EloquentFilter\Filterable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;


class Category extends Model
{
    use SoftDeletes, Filterable;
    use Uuid;
    protected $fillable = ["name","description","is_active"];
    protected $dates = ['deleted_at'];
    public $incrementing = false;
    protected $casts = [
        "id" => 'string',
        "is_active" => 'boolean'
    ] ;

    public function modelFilter(){
        return $this->provideFilter(CategoryFilter::class);
    }

}
