<?php

namespace App\ModelFilters;

use App\Models\CastMember;

class CastMemberFilter extends DefaultModelFilter
{
    /**
    * Related Models that have ModelFilters as well as the method on the ModelFilter
    * As [relationMethod => [input_key1, input_key2]].
    *
    * @var array
    */
    public $sortable = ['name','created_at', 'type'];

    public function search($search){
        $this->query->where("name", "LIKE", "%$search%");
    }

    public function type($type){
        $type_ = (int)$type;
        if(in_array((int)$type_,CastMember::$types)){
            $this->where('type',(int)$type_);
        }
    }
}
