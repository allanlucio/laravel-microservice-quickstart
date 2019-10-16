<?php

namespace Tests\Stubs\Models\Traits;

use App\Models\Traits\UploadFiles;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UploadFileStub extends Model
{
    use UploadFiles;
    public static $fileFields = ['file1','file2'];
    protected $fillable = ["name",'file1','file2'];
    protected $table = 'upload_file_stubs';

    public static function makeTable(){

        Schema::create('upload_file_stubs', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string("name");
            $table->text("file1")->nullable();
            $table->text("file2")->nullable();
            $table->timestamps();
        });
    }



    public static function dropTable(){
        Schema::dropIfExists('upload_file_stubs');
    }

    protected function uploadDir()
    {
        return "1";
    }
}
