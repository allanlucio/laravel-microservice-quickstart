<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class GenreResource extends JsonResource
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
        $data = parent::toArray($request);
        $data['categories'] = $categories;

        return $data;
    }
}
