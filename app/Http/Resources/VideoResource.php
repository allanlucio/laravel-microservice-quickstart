<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class VideoResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        $categories = CategoryResource::collection($this->categories);
        $genres = GenreResource::collection($this->genres);
        $data = parent::toArray($request);
        $data['categories'] = $categories;
        $data['genres'] = $genres;
        $data['banner_file_url'] = $this->banner_file_url;
        $data['thumb_file_url'] = $this->thumb_file_url;
        $data['video_file_url'] = $this->video_file_url;
        $data['trailer_file_url'] = $this->trailer_file_url;

        return $data;
    }
}
