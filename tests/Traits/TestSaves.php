<?php

declare(strict_types=1);

namespace Tests\Traits;

use Illuminate\Foundation\Testing\TestResponse;

trait TestSaves{

    protected abstract function model();
    protected abstract function routeStore();
    protected abstract function routeUpdate();

    protected function assertStore(array $sendData,array $testDatabase, array $testJsonData = null): TestResponse{
        $response = $this->json('post',$this->routeStore(),$sendData);
        if($response->status() !== 201){
            throw new \Exception("Response status must be 201, given {$response->status()}:\n{$response->content()}");
        }
        $this->assertInDatabase($response,$testDatabase);
        $this->assertJsonResponseContent($response,$testDatabase,$testJsonData);




        return $response;
    }
    protected function assertUpdate(array $sendData,array $testDatabase, array $testJsonData = null): TestResponse{
        $response = $this->json('put',$this->routeUpdate(),$sendData);
        if($response->status() !== 200){
            throw new \Exception("Response status must be 200, given {$response->status()}:\n{$response->content()}");
        }


        $this->assertInDatabase($response,$testDatabase);
        $this->assertJsonResponseContent($response,$testDatabase,$testJsonData);

        return $response;
    }

    private function assertInDatabase($response, $testDatabase){
        $model = $this->model();
        $table = (new $model)->getTable();
        $testDatabase["id"]=$response->json("id");
        $this->assertDatabaseHas($table,$testDatabase);
    }
    private function assertJsonResponseContent($response, $testDatabase, $testJsonData){
        $testResponse = $testJsonData ?? $testDatabase;
        $testResponse["id"]=$response->json("id");
        $response->assertJsonFragment($testResponse);
    }

    private function assertManyToManyRelashionships($id,$relashionship,$elements){

        $relashionship_elements = $this->model()::find($id)
            ->$relashionship->whereIn("id",$elements);

        $this->assertEquals(count($elements),$relashionship_elements->count());
    }




}
