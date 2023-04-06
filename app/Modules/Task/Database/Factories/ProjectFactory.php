<?php

namespace App\Modules\Task\Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class ProjectFactory extends Factory
{
  protected $model = Project::class;

  public function definition()
  {
    return [
      'name' => $this->faker->domainWord(),
    ];
  }
}
