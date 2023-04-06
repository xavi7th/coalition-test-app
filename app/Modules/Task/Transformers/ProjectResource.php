<?php

namespace App\Modules\Task\Transformers;

use Illuminate\Http\Resources\Json\JsonResource;

class ProjectResource extends JsonResource
{
  /**
   * Transform the resource into an array.
   *
   * @param  \Illuminate\Http\Request
   * @return array
   */
  public function toArray($request)
  {
    return [
      'id' => $this->id,
      'name' => $this->name,
      'poster_url' => $this->poster_url,
      'poster_thumb_url' => $this->poster_thumb_url,
      'icon_url' => $this->icon_url,
      'is_active' => $this->is_active,
      'is_suspended' => ! $this->is_active,
    ];
  }
}
