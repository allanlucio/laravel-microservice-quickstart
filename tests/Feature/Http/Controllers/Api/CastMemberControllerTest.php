<?php

namespace Tests\Feature\Http\Controllers\Api;

use App\Http\Resources\CastMemberResource;
use App\Models\CastMember;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;
use Tests\Traits\TestResources;
use Tests\Traits\TestSaves;
use Tests\Traits\TestValidations;

class CastMemberControllerTest extends TestCase
{
    use DatabaseMigrations, TestValidations, TestSaves, TestResources;
    private $cast_member;
    private $serializedFields = [
        "id","name","type","created_at",'updated_at',"deleted_at"
    ];
    protected function setUp(): void
    {
        parent::setUp();
        $this->cast_member = factory(CastMember::class)->create([
            "type"=>CastMember::TYPE_DIRECTOR
            ]);

        }
        public function testIndex()
        {

            $response = $this->get(route("cast_members.index"));

            $response
            ->assertStatus(200);
            $this->assertResourceJsonData($response,['*'=>$this->serializedFields]);
            $this->assertResourcePaginate($response,15);
            $resource = CastMemberResource::collection(collect([$this->cast_member]));
            $this->assertResource($response,$resource);
        }

        public function testShow()
        {

            $response = $this->get(route("cast_members.show",['cast_member'=>$this->cast_member->id]));

            $response
            ->assertStatus(200);
            $this->assertModelResource($response);

        }

        public function testInvalidationData(){

            $data = [
                'name' => '',
                'type' => ''
            ];
            $this->assertInvalidationInStoreAction($data,'required');
            $this->assertInvalidationInUpdateAction($data,'required');

            $data = [
                "type"=>'s'
            ];

            $this->assertInvalidationInStoreAction($data,'in');
            $this->assertInvalidationInUpdateAction($data,'in');




        }


        public function testStore(){
            $data = [
                [
                    "name" => "test",
                    "type" => CastMember::TYPE_DIRECTOR
                ],
                [
                    "name" => "test",
                    "type" => CastMember::TYPE_ACTOR
                    ]

                ];
                foreach($data as $key=>$value){
                    $response = $this->assertStore($value,$value + ['deleted_at'=>null]);
                    $this->assertModelResource($response);
                }

            }

            public function testUpdate(){

                $data = [
                    "name" => "test2",
                    "type" => CastMember::TYPE_ACTOR
                ];

                $response = $this->assertUpdate($data,$data + ['deleted_at'=>null]);
                $this->assertModelResource($response);

            }

            public function testDelete(){
                $cast_member = factory(CastMember::class)->create();
                $response = $this->json('delete',route("cast_members.destroy",['cast_member'=>$cast_member->id]));


                $cast_member = CastMember::find($cast_member->id);
                $response->assertStatus(204);
                $this->assertNull($cast_member);
            }

            protected function routeStore(){
                return route('cast_members.store');
            }

            protected function routeUpdate(){
                return route('cast_members.update',['cast_member'=>$this->cast_member->id]);
            }
            protected function model(){
                return CastMember::class;
            }
            protected function resource(){
                return CastMemberResource::class;
            }
        }
