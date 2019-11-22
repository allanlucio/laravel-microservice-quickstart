<?php

namespace Tests\Unit\Models;

use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\Stubs\Models\Traits\UploadFileStub;
use Tests\TestCase;

class UploadFilesUnitTest extends TestCase
{

    private $obj;

    protected function setUp(): void{
        parent::setUp();
        $this->obj = new UploadFileStub();
    }

    protected function teardown(): void{
        parent::teardown();

    }

    public function testUploadfile(){
        Storage::fake("");
        $file = UploadedFile::fake()->create("video.mp4");
        $this->obj->uploadFile($file);
        Storage::assertExists("1/{$file->hashName()}");
    }

    public function testUploadfiles(){
        Storage::fake("");
        $file = UploadedFile::fake()->create("video.mp4");
        $file2 = UploadedFile::fake()->create("video2.mp4");
        $this->obj->uploadFiles([$file,$file2]);
        Storage::assertExists("1/{$file->hashName()}");
        Storage::assertExists("1/{$file2->hashName()}");
    }

    public function testDeleteOldFiles(){
        Storage::fake();
        $file = UploadedFile::fake()->create("video1.mp4")->size(1);
        $file2 = UploadedFile::fake()->create("video2.mp4")->size(1);
        $this->obj->uploadFiles([$file,$file2]);
        $this->obj->deleteOldFiles();
        $this->assertCount(2,Storage::allFiles());

        $this->obj->oldFiles = [$file->hashName()];
        $this->obj->deleteOldFiles();

        Storage::assertMissing("1/{$file->hashName()}");

        Storage::assertExists("1/{$file2->hashName()}");

    }
    public function testDeleteFile(){
        Storage::fake();
        $file = UploadedFile::fake()->create("video.mp4");
        $this->obj->uploadFile($file);
        $this->obj->deleteFile($file->hashName());
        Storage::assertMissing("1/{$file->hashName()}");

        $file = UploadedFile::fake()->create("video.mp4");
        $this->obj->uploadFile($file);
        $this->obj->deleteFile($file);
        Storage::assertMissing("1/{$file->hashName()}");

    }

    public function testDeletefiles(){
        Storage::fake("");
        $file = UploadedFile::fake()->create("video.mp4");
        $file2 = UploadedFile::fake()->create("video2.mp4");
        $files=[$file,$file2];
        $this->obj->uploadFiles($files);
        $this->obj->deleteFiles([$file->hashName(),$file2]);

        Storage::assertMissing("1/{$file->hashName()}");
        Storage::assertMissing("1/{$file2->hashName()}");
    }

    public function testExtractFiles(){
        $attributes = [];
        $files = UploadFileStub::extracFiles($attributes);

        $this->assertCount(0,$attributes);
        $this->assertCount(0,$files);

        $attributes = ['file'=>'test'];
        $files = UploadFileStub::extracFiles($attributes);

        $this->assertCount(1,$attributes);
        $this->assertEquals($attributes,['file'=>'test']);
        $this->assertCount(0,$files);

        $attributes = ['file'=>'test','file2'=>'test'];
        $files = UploadFileStub::extracFiles($attributes);

        $this->assertCount(2,$attributes);
        $this->assertEquals($attributes,['file'=>'test','file2'=>'test']);
        $this->assertCount(0,$files);

        $file = UploadedFile::fake()->create("video.mp4");

        $attributes = ['file'=>$file,'file2'=>'test'];
        $files = UploadFileStub::extracFiles($attributes);

        $this->assertCount(2,$attributes);
        $this->assertEquals($attributes,['file'=>$file->hashName(),'file2'=>'test']);

        $this->assertCount(1,$files);
        $this->assertEquals($files,[$file]);

        $file = UploadedFile::fake()->create("video.mp4");
        $file2 = UploadedFile::fake()->create("video2.mp4");
        $attributes = ['file'=>$file,'file2'=>$file2,'other'=>'test'];
        $files = UploadFileStub::extracFiles($attributes);

        $this->assertCount(3,$attributes);
        $this->assertEquals($attributes,['file'=>$file->hashName(),'file2'=>$file2->hashName(),'other'=>'test']);

        $this->assertCount(2,$files);
        $this->assertEquals($files,[$file,$file2]);
    }


    public function testGetFileUrl(){
        Storage::fake("");
        $file = UploadedFile::fake()->create("video.mp4");
        $this->obj->uploadFile($file);
        $file_hash_name = $file->hashName();
        $file_url = $this->obj->getFileUrl($file_hash_name);

        $this->assertEquals($file_url,"/storage/1/{$file_hash_name}");

        // $this->obj->deleteFile($file);
        // $this->assertNull($this->obj->getFileUrl($file_hash_name));
    }

    public function testRelativeFilePath(){
        $this->assertEquals("1/video.mp4",$this->obj->relativeFilePath('video.mp4'));
    }




}
