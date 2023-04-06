<?php

namespace App\Modules\Task\Models;

use App\Models\BaseModel;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Modules\Task\Database\Factories\ProjectFactory;

class Project extends BaseModel
{
  use HasFactory;

  protected $fillable = ['name'];

  protected $appends = ['name_slug'];

  public function tasks()
  {
    return $this->hasMany(Task::class);
  }

  public function getNameSlugAttribute()
  {
    return Str::slug($this->name);
  }

  protected static function newFactory()
  {
    return ProjectFactory::new();
  }
}
