<?php

namespace App\Models;

use App\Models\Traits\Uuid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CastMember extends Model
{
    use SoftDeletes;
    use Uuid;
    const TYPE_ACTOR = 0;
    const TYPE_DIRECTOR = 1;
    protected $fillable = ["name","type"];
    protected $dates = ['deleted_at'];
    public $incrementing = false;
    protected $casts = [
        "id" => 'string',
        "type" => 'int'
    ] ;
}
