<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\VideoResource;
use App\Models\Video;
use App\Rules\GenresHasCategoriesRule;
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
            "year_launched"=>'required|min:1|date_format:Y',
            'opened'=>"boolean",
            'rating'=>"required|in:".implode(",",Video::RATING_LIST),
            'duration'=>"required|integer|min:1",
            "categories_id"=>"required|array|exists:categories,id,deleted_at,NULL",
            "genres_id"=>["required","array","exists:genres,id,deleted_at,NULL"],
            "cast_members_id"=>[
                "required",
                "array",
                "exists:cast_members,id,deleted_at,NULL"
            ],
            "video_file"=>"nullable|mimetypes:video/mp4|max:".Video::VIDEO_FILE_MAX_SIZE,
            "trailer_file"=>"nullable|mimetypes:video/mp4|max:".Video::TRAILER_FILE_MAX_SIZE,
            "thumb_file"=>"nullable|image|max:".Video::THUMB_FILE_MAX_SIZE,
            "banner_file"=>"nullable|image|max:".Video::BANNER_FILE_MAX_SIZE

        ];

    }

    public function store(Request $request)
    {

        $this->addRuleIfGenreHasCategories($request);
        $validated_data = $this->validate($request,$this->rulesStore());
        $obj = $this->model()::create($validated_data);

        $obj->refresh();

        $resource = $this->resource();
        return new $resource($obj);
    }

    public function update(Request $request, $id)
    {

        $request["opened"] = $request["opened"]==='true';
        $this->addRuleIfGenreHasCategories($request);
        $validated_data = $this->validate($request,$this->rulesUpdate());
        $obj=$this->findOrFail($id);
        $obj->update($validated_data);

        $resource = $this->resource();
        return new $resource($obj);
    }
    protected function addRuleIfGenreHasCategories(Request $request){
        $categoriesId=$request->get("categories_id");
        $categoriesId = is_array($categoriesId)? $categoriesId:[];
        $this->rules["genres_id"][] = new GenresHasCategoriesRule($categoriesId);

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
    protected function resourceCollection()
    {
        return $this->resource();
    }
    protected function resource(){
        return VideoResource::class;
    }
}
