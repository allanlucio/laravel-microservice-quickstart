<?php
namespace Tests\Traits;

use Illuminate\Foundation\Testing\TestResponse;
use Illuminate\Http\Resources\Json\JsonResource;

trait TestResources{
    protected abstract function resource();

    protected function assertModelResource(TestResponse $response,$data=null,$fields=null){
        $model_class = $this->model();
        $resource_class = $this->resource();

        if($data == null){
            $id = $response->json("data.id");
            $data = $model_class::find($id);
        }

        if($fields == null){
            $fields = $this->serializedFields;
        }

        $resource = new $resource_class($data);
        $this->assertResource($response,$resource);
        $this->assertResourceJsonData($response,$fields);
    }

    protected function assertResource(TestResponse $response, JsonResource $resource){
        $response->assertJson($resource->response()->getData(true));
    }
    protected function assertResourcePaginate(TestResponse $response,$paginate_count){
        $response->assertJson([
            'meta'=> ['per_page'=>$paginate_count],
            'links' =>[]
        ]);
    }
    protected function assertResourceJsonData(TestResponse $response,$data){
        $response->assertJsonStructure([
            'data'=>$data,
        ]);
    }
}
