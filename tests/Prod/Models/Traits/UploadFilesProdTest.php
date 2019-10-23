<?php

namespace Tests\Prod\Models\Traits;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\Stubs\Models\Traits\UploadFileStub;
use Tests\TestCase;
use Tests\Traits\TestProd;
use Tests\Traits\TestStorages;

class UploadFilesProdTest extends TestCase
{
    use TestStorages,TestProd;


    private $obj;

    protected function setUp(): void{
        parent::setUp();
        $this->skipTestIfNotProd("Testes de produção");
        $this->obj = new UploadFileStub();
        \Config::set("filesystems.default","gcs");



    }
    protected function teardown(): void{
        parent::setUp();
        $this->deleteAllFiles();
    }

    public function testUploadfile(){

        $file = UploadedFile::fake()->create("video.mp4");
        $this->obj->uploadFile($file);
        Storage::assertExists("1/{$file->hashName()}");
    }

    public function testUploadfiles(){

        $file = UploadedFile::fake()->create("video.mp4");
        $file2 = UploadedFile::fake()->create("video2.mp4");
        $this->obj->uploadFiles([$file,$file2]);
        Storage::assertExists("1/{$file->hashName()}");
        Storage::assertExists("1/{$file2->hashName()}");
    }

    public function testDeleteOldFiles(){

        $file1 = UploadedFile::fake()->create("video1.mp4")->size(1);
        $file2 = UploadedFile::fake()->create("video2.mp4")->size(1);
        $this->obj->uploadFiles([$file1,$file2]);
        $this->obj->deleteOldFiles();
        $this->assertCount(2,Storage::allFiles());

        $this->obj->oldFiles = [$file1->hashName()];
        $this->obj->deleteOldFiles();
        Storage::assertMissing("1/{$file1->hashName()}");
        Storage::assertExists("1/{$file2->hashName()}");

    }
    public function testDeleteFile(){

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

        $file = UploadedFile::fake()->create("video.mp4");
        $file2 = UploadedFile::fake()->create("video2.mp4");
        $files=[$file,$file2];
        $this->obj->uploadFiles($files);
        $this->obj->deleteFiles([$file->hashName(),$file2]);

        Storage::assertMissing("1/{$file->hashName()}");
        Storage::assertMissing("1/{$file2->hashName()}");
    }

    // public function testGetFilesUrlNull(){
    //     UploadFileStub::dropTable();
    //     UploadFileStub::makeTable();
    //     $this->obj->fill([
    //         "name"=>"test"
    //     ]);

    //     $this->obj->save();

    //     $this->assertNull($this->obj->file_url);


    // }

    public function testFilesUrlExists(){
        UploadFileStub::dropTable();
        UploadFileStub::makeTable();

        $file = UploadedFile::fake()->image("file.jpg");
        $obj= UploadFileStub::create([
            "name"=>"test",
            "file" => $file,

        ]);

        ;
        Storage::assertExists("1/{$obj->file}");
        $this->assertEquals(env("GOOGLE_CLOUD_STORAGE_API_URI")."/1/{$file->hashName()}", $obj->file_url);

    }






}
