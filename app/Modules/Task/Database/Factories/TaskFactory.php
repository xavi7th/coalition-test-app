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
      'project_id' => Project::inRandomOrder()->first() ?? Project::factory()->create(),
      'priority' => $this->faker->randomDigitNotZero()
    ];
  }
}
