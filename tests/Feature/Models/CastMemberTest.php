<?php

namespace Tests\Feature\Models;

use App\Models\CastMember;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class CastMemberTest extends TestCase
{
    use DatabaseMigrations;
    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function testList()
    {
        $CastMember=factory(CastMember::class)->create();
        $cast_members = CastMember::all();
        $this->assertCount(1, $cast_members);

        $CastMemberKeys = array_keys($cast_members->first()->getAttributes());

        $keys = [
            "id",
            "name",
            "type",
            "deleted_at",
            "created_at",
            "updated_at"
        ];
        $this->assertEqualsCanonicalizing($keys,$CastMemberKeys);
    }

    public function testCreate(){
        $CastMember = CastMember::create(
            ["name"=>"test1","type"=>CastMember::TYPE_ACTOR]
        );
        $CastMember->refresh();

        $this->assertEquals("test1",$CastMember->name);
        $this->assertEquals(CastMember::TYPE_ACTOR,$CastMember->type);
        $this->assertRegExp('/^\w{8}\-\w{4}\-\w{4}\-\w{4}\-\w{12}$/',$CastMember->id);

    }

    public function testUpdate(){
        $CastMember = $CastMember = factory(CastMember::class)->create([
            "type" => CastMember::TYPE_ACTOR
        ]);

        $data = [
            "name" => 'test_name_update',
            "type" => CastMember::TYPE_DIRECTOR
        ];
        $CastMember->update($data);

        foreach( $data as $key => $value){
            $this->assertEquals($value,$CastMember->{$key});
        }



    }

    public function testDelete(){
        $CastMember = $CastMember = factory(CastMember::class)->create();
        $CastMember->delete();

        $CastMember_after_delete = CastMember::find($CastMember->id);
        $CastMember_on_trash = CastMember::withTrashed()->find($CastMember->id);
        $this->assertNull($CastMember_after_delete);
        $this->assertNotNull($CastMember_on_trash->updated_at);

        $CastMember_on_trash->forceDelete();
        $CastMember_on_trash_after_force_delete = CastMember::withTrashed()->find($CastMember->id);
        $this->assertNull($CastMember_on_trash_after_force_delete);
    }
}
