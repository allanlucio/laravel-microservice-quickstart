<?php

namespace App\ModelFilters;

use Illuminate\Database\Eloquent\Builder;

class VideoFilter extends DefaultModelFilter
{
    /**
    * Related Models that have ModelFilters as well as the method on the ModelFilter
    * As [relationMethod => [input_key1, input_key2]].
    *
    * @var array
    */
    public $sortable = ['title','created_at'];

    public function search($search){
        $this->query->where("title", "LIKE", "%$search%");
    }

    public function categories($categories){
        $idsOrNames = explode(",",$categories);
        $this->whereHas('categories',function(Builder $query) use ($idsOrNames){
            $query
                ->whereIn('id',$idsOrNames)
                ->orWhereIn('name',$idsOrNames);
        });
    }
}
