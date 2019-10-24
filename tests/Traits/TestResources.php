<?php
namespace Tests\Traits;

use Illuminate\Foundation\Testing\TestResponse;
use Illuminate\Http\Resources\Json\JsonResource;

trait TestResources{

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
