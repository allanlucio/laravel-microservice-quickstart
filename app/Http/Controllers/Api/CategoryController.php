<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryCollection;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends BasicCrudController
{

    private $rules = [
        "name" => "required|max:255",
        'description'=>'nullable',
        "is_active" => "boolean"

    ];

    // public function index(){
    //     $collection = parent::index();

    //     return new CategoryCollection($collection);

    // }
    // public function show($id){
    //     $obj = parent::show($id);
    //     return new CategoryResource($obj);
    // }

    protected function model(){
        return Category::class;
    }

    protected function rulesStore():array{
        return $this->rules;
    }

    protected function rulesUpdate():array{
        return $this->rules;
    }

    protected function resource(){
        return CategoryResource::class;
    }


}
