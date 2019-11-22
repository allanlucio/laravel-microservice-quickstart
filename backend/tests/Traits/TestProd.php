<?php
namespace Tests\Traits;

use Illuminate\Foundation\Testing\TestResponse;

trait TestProd{

    protected function skipTestIfNotProd($message=""){
        if(!$this->isTestingProd()){
            $this->markTestSkipped($message);
        }

    }

    protected function isTestingProd(){
        return env("TESTING_PROD") !== false;
    }
}
