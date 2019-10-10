<?php

namespace Tests\Stubs\Models\Traits;

use App\Models\Traits\UploadFiles;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UploadFileStub extends Model
{
    use UploadFiles;
    public static $fileFields = ['file1','file2','other'];
    // protected $fillable = ["name","description"];
    // protected $table = 'category_stubs';

    // public static function createTable(){

    //     Schema::create('category_stubs', function (Blueprint $table) {
    //         $table->bigIncrements('id');
    //         $table->string("name");
    //         $table->text("description")->nullable();
    //         $table->timestamps();
    //     });
    // }



    // public static function dropTable(){
    //     Schema::dropIfExists('category_stubs');
    // }

    protected function uploadDir()
    {
        return "1";
    }
}
