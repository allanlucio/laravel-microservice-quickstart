<?php

namespace App\ModelFilters;

use Illuminate\Database\Eloquent\Builder;

class CategoryFilter extends DefaultModelFilter
{
    /**
    * Related Models that have ModelFilters as well as the method on the ModelFilter
    * As [relationMethod => [input_key1, input_key2]].
    *
    * @var array
    */
    public $sortable = ['name','created_at', 'is_active'];

    public function search($search){
        $this->query->where("name", "LIKE", "%$search%");
    }

    public function genres($genres){
        $idsOrNames = explode(",",$genres);
        $this->whereHas('genres',function(Builder $query) use ($idsOrNames){
            $query
                ->whereIn('id',$idsOrNames);
        });
    }
}
