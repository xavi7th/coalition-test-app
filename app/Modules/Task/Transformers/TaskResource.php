<?php

namespace App\Modules\Task\Transformers;

use Illuminate\Http\Resources\Json\JsonResource;

class TaskResource extends JsonResource
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
      'course_category_id' => $this->course_category_id,

      'course_category' => $this->when($this->relationLoaded('course_category') && $this->course_category, fn() => $this->course_category->name),
    ];
  }
}
