<?php

namespace Tests\Stubs\Controllers;

use App\Http\Controllers\Api\BasicCrudController;
use Tests\Stubs\Models\CategoryStub;
use Tests\Stubs\Resources\CategoryResourceStub;

class CategoryControllerStub extends BasicCrudController
{
    protected function model(){
        return CategoryStub::class;
    }



    protected function rulesStore():array{
        return [
            "name" => "required|max:255",
            "description" => "nullable",
        ];
    }

    protected function rulesUpdate():array{
        return [
            "name" => "required|max:255",
            "description" => "nullable",
            'id' => 'required|exists:category_stubs,id'
        ];
    }

    protected function resource(){
        return CategoryResourceStub::class;
    }
    protected function resourceCollection()
    {
        return $this->resource();
    }
}
