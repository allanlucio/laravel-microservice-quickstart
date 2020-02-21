<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use EloquentFilter\Filterable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;
use Illuminate\Support\Facades\Request as IlluminateRequest;
use Validator;

abstract class BasicCrudController extends Controller
{

    protected $defaultPerPage = 15;

    protected abstract function model();
    protected abstract function rulesStore(): array;
    protected abstract function rulesUpdate(): array;
    protected abstract function resource();
    protected abstract function resourceCollection();

    public function index(Request $request)
    {

        $perPage = (int) $request->get('per_page', $this->defaultPerPage);
        $hasFilter = in_array(Filterable::class, class_uses($this->model()));
        // Category::filter(\Request::all())->get();
        $query = $this->queryBuilder();
        if ($hasFilter) {
            $query = $query->filter($request->all());
        }

        $data = $request->has('all') || !$this->defaultPerPage
            ? $query->get()
            : $query->paginate($perPage);

        // $collection = !$this->perPage ? $this->model()::all(): $this->model()::paginate($perPage);

        $refClass = new \ReflectionClass($this->resourceCollection());
        $resourceCollectionClass = $this->resourceCollection();

        return $refClass->isSubClassOf(ResourceCollection::class) ? new $resourceCollectionClass($data) : $resourceCollectionClass::collection($data);
    }

    public function store(Request $request)
    {

        $validated_data = $this->validate($request, $this->rulesStore());
        $obj = $this->model()::create($validated_data);
        $obj->refresh();
        $resource = $this->resource();


        return new $resource($obj);
    }

    protected function findOrFail($id)
    {

        $model = $this->model();
        $keyName = (new $model)->getRouteKeyName();
        return $this->model()::where($keyName, $id)->firstOrFail();
    }
    public function show($id)
    {
        $obj = $this->findOrFail($id);
        $resource = $this->resource();
        return new $resource($obj);
    }

    public function update(Request $request, $id)
    {

        $validated_data = $this->validate($request, $this->rulesUpdate());
        $obj = $this->findOrFail($id);
        $obj->update($validated_data);

        $resource = $this->resource();


        return new $resource($obj);
    }

    public function destroy($id)
    {
        $obj = $this->findOrFail($id);
        $obj->delete();

        return response()->noContent();
    }

    public function destroyCollection(Request $request)
    {
        $data = $this->validateIds($request);
        $this->model()::whereIn('id', $data['ids'])->delete();
        return response()->noContent();
    }

    protected function validateIds(Request $request)
    {
        $model = $this->model();
        $ids = explode(",", $request->get('ids'));
        $validator = Validator::make(
            [
                "ids" => $ids
            ],
            [
                'ids' => 'required|exists:' . (new $model)->getTable() . ',id'
            ]
        );
        return $validator->validate();
    }

    protected function queryBuilder(): Builder
    {
        return $this->model()::query();
    }
}
