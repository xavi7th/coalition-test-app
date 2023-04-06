<?php

namespace App\Modules\Task\Models;

use App\Models\BaseModel;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Builder;
use App\Modules\Task\Database\Factories\TaskFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Task extends BaseModel
{
  use HasFactory;

  protected $fillable = ['name', 'project_id', 'priority', 'completed_at'];

  protected $appends = ['name_slug', 'is_completed'];

  protected $casts = [
    'priority' => 'int',
    'completed_at' => 'datetime',
    'is_completed' => 'bool',
  ];

  public function project()
  {
    return $this->belongsTo(Project::class);
  }

  public function getNameSlugAttribute()
  {
    return Str::slug($this->name);
  }

  public function getIsCompletedAttribute(): bool
  {
    return ! is_null($this->completed_at);
  }

  public function scopePending(Builder $q)
  {
    $q->whereNull('completed_at');
  }

  public function scopeCompleted(Builder $q)
  {
    $q->whereNotNull('completed_at');
  }

  protected static function newFactory()
  {
    return TaskFactory::new();
  }
}
