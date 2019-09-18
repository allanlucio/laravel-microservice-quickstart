<?php

namespace App\Http\Controllers\Api;


use App\Http\Controllers\Controller;
use App\Models\CastMember;
use Illuminate\Http\Request;

class CastMemberController extends Controller
{
    private $rules;


    protected function model(){
        return CastMember::class;
    }

    protected function rulesStore():array{
        return $this->rules;
    }

    protected function rulesUpdate():array{
        return $this->rules;
    }
}
