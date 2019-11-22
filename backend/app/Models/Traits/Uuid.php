<?php

namespace App\Models\Traits;

use Ramsey\Uuid\Uuid as RamseyUuid;

trait Uuid{
    public static function bootUuid(){

        static::creating(function($obj){
            $obj->id = RamseyUuid::uuid4();
        });
    }

}
