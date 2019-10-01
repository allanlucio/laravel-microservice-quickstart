<?php

namespace Tests\Unit\Rule;

use App\Rules\GenresHasCategoriesRule;
use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Mockery\MockInterface;

class GenresHasCategoriesRuleUnitTest extends TestCase
{

    public function testCategoriesIdField()
    {
        $rule = new GenresHasCategoriesRule(
            [1,1,2,2]
        );

        $reflectionClass = new \ReflectionClass(GenresHasCategoriesRule::class);
        $reflectionProperty = $reflectionClass->getProperty("categoriesId");
        $reflectionProperty->setAccessible(true);
        $categoriesId = $reflectionProperty->getValue($rule);
        $this->assertEqualsCanonicalizing([1,2],$categoriesId);

    }
    public function testGenresIdValue()
    {
        $rule = $this->createRuleMock([]);
        $rule
            ->shouldReceive("getCategoryGenres")
            ->withAnyArgs()
            ->andReturnNull();
        $rule->passes('',[1,1,2,2]);
        $reflectionClass = new \ReflectionClass(GenresHasCategoriesRule::class);
        $reflectionProperty = $reflectionClass->getProperty("genresId");
        $reflectionProperty->setAccessible(true);
        $genresId = $reflectionProperty->getValue($rule);
        $this->assertEqualsCanonicalizing([1,2],$genresId);


    }

    public function testPAssesReturnsFalseWhenCategoriesOrGenresIsArrayEmpty(){
        $rule = $this->createRuleMock([1]);
        $this->assertFalse($rule->passes("",[]));

        $rule = $this->createRuleMock([]);
        $this->assertFalse($rule->passes("",[1]));
    }

    public function testPAssesReturnsFalseWhengetCategoryGenresIsEmpty(){
        $rule = $this->createRuleMock([1]);
        $rule
            ->shouldReceive("getCategoryGenres")
            ->withAnyArgs()
            ->andReturn(collect([]));
        $this->assertFalse($rule->passes("",[]));
    }

    public function testPassesReturnsFalseWhenHasCategoriesWithoutGenres(){
        $rule = $this->createRuleMock([1,2]);
        $rule
            ->shouldReceive("getCategoryGenres")
            ->withAnyArgs()
            ->andReturn(collect(["category_id"=>1]));
        $this->assertFalse($rule->passes("",[1]));
    }

    public function testPassesIsValid(){
        // $rule = $this->createRuleMock([1]);
        // $rule
        //     ->shouldReceive("getCategoryGenres")
        //     ->withAnyArgs()
        //     ->andReturn(collect(
        //         ["category_id"=>1]

        //     ));
        // $this->assertTrue($rule->passes("",[1,2]));

        $rule = $this->createRuleMock([1,2]);
        $rule
            ->shouldReceive("getCategoryGenres")
            ->withAnyArgs()
            ->andReturn(collect([
                ["category_id"=>1],
                ["category_id"=>2],
                ["category_id"=>1],
                ["category_id"=>2]
                ]
            ));

        $this->assertTrue($rule->passes("",[1]));
    }

    protected function createRuleMock(array $categoriesId): MockInterface{
        return \Mockery::mock(GenresHasCategoriesRule::class, [$categoriesId])
            ->makePartial()
            ->shouldAllowMockingProtectedMethods();
    }




}
