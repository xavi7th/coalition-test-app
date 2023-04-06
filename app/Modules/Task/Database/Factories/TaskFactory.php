<?php

namespace App\Modules\Task\Database\Factories;

use App\Modules\Task\Models\Task;
use App\Modules\Task\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;

class TaskFactory extends Factory
{
  protected $model = Task::class;

  public function definition()
  {
    return [
      'name' => $this->faker->sentence(),
      'course_category_id' => Project::factory()->create(),
    ];
  }
}
