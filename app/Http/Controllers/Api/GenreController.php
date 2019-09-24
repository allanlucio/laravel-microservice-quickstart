<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Genre;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class GenreController extends BasicCrudController
{
    private $rules = [
        "name" => "required|max:255",
        "is_active" => "boolean",
        "categories_id"=>"required|array|exists:categories,id"
    ];

    public function store(Request $request)
    {
        $validated_data = $this->validate($request,$this->rulesStore());
        $self = $this;
        $obj = DB::transaction(function () use($request,$validated_data,$self){
            $obj = $this->model()::create($validated_data);
            $self->handleRelations($obj,$request);
            return $obj;
        });

        $obj->refresh();

        return $obj;
    }

    public function update(Request $request, $id)
    {
        $validated_data = $this->validate($request,$this->rulesUpdate());
        $obj=$this->findOrFail($id);
        $self = $this;
        $obj = DB::transaction(function () use($request,$validated_data,$obj,$self){
            $obj->update($validated_data);
            $self->handleRelations($obj,$request);
            return $obj;
        });

        return $obj;
    }

    protected function handleRelations($video, Request $request){
        $video->categories()->sync($request->get("categories_id"));

    }

    protected function model(){
        return Genre::class;
    }

    protected function rulesStore():array{
        return $this->rules;
    }

    protected function rulesUpdate():array{
        return $this->rules;
    }
}
