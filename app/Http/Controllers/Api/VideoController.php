<?php

namespace App\Http\Controllers\Api;

use App\Models\Video;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class VideoController extends BasicCrudController
{
    private $rules;

    public function __construct()
    {
        $this->rules = [
            "title"=>"required|max:255",
            "description"=>"required",
            "year_launched"=>'required|date_format:Y',
            'opened'=>"boolean",
            'rating'=>"required|in:".implode(",",Video::RATING_LIST),
            'duration'=>"required|integer",
            "categories_id"=>"required|array|exists:categories,id",
            "genres_id"=>"required|array|exists:genres,id"
        ];

    }

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
        $video->genres()->sync($request->get("genres_id"));
    }
    protected function model(){
        return Video::class;
    }

    protected function rulesStore():array{
        return $this->rules;
    }

    protected function rulesUpdate():array{
        return $this->rules;
    }
}
