<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Request as IlluminateRequest;

abstract class BasicCrudController extends Controller
{

    protected abstract function model();
    protected abstract function rulesStore(): array;
    protected abstract function rulesUpdate(): array;
    protected abstract function resource();

    public function index()
    {

        // if($request->has("only_trashed")){

        //     return $this->model()::withTrashed()->get();
        // }
        return $this->model()::all();
    }

    public function store(Request $request)
    {
        $validated_data = $this->validate($request,$this->rulesStore());
        $obj = $this->model()::create($validated_data);
        $obj->refresh();
        $resource = $this->resource();


        return new $resource($obj);

    }

    protected function findOrFail($id){
        $model = $this->model();
        $keyName = (new $model)->getRouteKeyName();
        return $this->model()::where($keyName,$id)->firstOrFail();
    }
    public function show($id)
    {
        $obj = $this->findOrFail($id);
        $resource = $this->resource();
        return new $resource($obj);
    }

    public function update(Request $request, $id)
    {

        $validated_data = $this->validate($request,$this->rulesUpdate());
        $obj=$this->findOrFail($id);
        $obj->update($validated_data);

        $resource = $this->resource();


        return new $resource($obj);
    }

    public function destroy($id)
    {
        $obj=$this->findOrFail($id);
        $obj->delete();

        return response()->noContent();
    }
}
