<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BaseModel extends Model
{
  public function scopeWhereNot($query, $column, $value = NULL)
  {
    $query->where($column, $value, NULL, 'and not');
  }

  /**
   * @param Builder $query
   * @param string|Closure $column
   * @param mixed $value
   */
  public function scopeOrWhereNot($query, $column, $value = NULL)
  {
    $query->where($column, $value, NULL, 'or not');
  }
}
