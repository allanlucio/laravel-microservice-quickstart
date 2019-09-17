<?php

declare(strict_types=1);

namespace Tests\Traits;

use Illuminate\Foundation\Testing\TestResponse;

trait TestValidations{

    protected function assertInvalidationInStoreAction(array $data,string $rule, $ruleParams = []){
        $response = $this->json('post',$this->routeStore(),$data);
        $fields = array_keys($data);
        $this->assertInvalidationFields($response, $fields, $rule, $ruleParams);


    }

    protected function assertInvalidationInUpdateAction(array $data,string $rule, $ruleParams = []){
        $response = $this->json('put',$this->routeUpdate(),$data);
        $fields = array_keys($data);
        $this->assertInvalidationFields($response, $fields, $rule, $ruleParams);


    }

    protected function assertInvalidationFields(TestResponse $response, array $fields, string $rule, array $ruleParams = []){
        $response
            ->assertStatus(422)
            ->assertJsonValidationErrors($fields);

        foreach($fields as $field){
            $field_name = str_replace('_'," ",$field);
            $response->assertJsonFragment([
                \Lang::get("validation.".$rule,["attribute"=>$field_name] + $ruleParams)
            ]);
        }

    }


}
