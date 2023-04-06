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
      'priority' => $this->priority,
      'is_completed' => $this->is_completed,
      'created_at' => $this->created_at->toDateTimeString(),

      'project_id' => $this->project_id,
      'project' => $this->when($this->relationLoaded('project') && $this->project, fn() => $this->project->name),
    ];
  }
}
