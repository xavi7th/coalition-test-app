<?php

namespace App\Modules\Task\Http\Controllers;

use Throwable;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Elegant\Sanitizer\Sanitizer;
use App\Modules\Task\Models\Task;
use App\Http\Controllers\Controller;
use App\Modules\Task\Models\Project;
use Illuminate\Support\Facades\Validator;
use App\Modules\Task\Transformers\TaskResource;
use App\Modules\Task\Transformers\ProjectResource;

class TaskController extends Controller
{
  public function index()
  {
    return Inertia::render('Task::ManageTasks', [
      'tasks' => fn() => TaskResource::collection(Task::pending()->with('project')->orderBy('priority') ->get()),
      'projects' => fn() => ProjectResource::collection(Project::all()),
    ])->withViewData([
      'title' => 'Manage Tasks',
      'metaDesc' => 'Coalition Job Application Test',
      'metaKeywords' => 'test-app',
      'ogUrl' => route('app.index'),
      'canonical' => route('app.index'),
    ]);
  }

  public function store(Request $request)
  {
    try {
      $sanitized_data  = $this->sanitizeData($request->all());
      $task = Task::create($this->validateData($sanitized_data));

      return redirect()->route('app.tasks.index')->withFlash(['success' => $task->name . ' task created']);
    } catch (Throwable $e) {
      logger($e);
      if (! app()->environment('production')) return back()->withFlash(['error' => $e->getMessage()]);
    }
    return back()->withFlash(['error' => 'Task not created!']);
  }

  public function update(Request $request, Task $task)
  {
    try {
      $sanitized_data  = $this->sanitizeData($request->all());
      $task->update($this->validateData($sanitized_data));

      return redirect()->route('app.tasks.index')->withFlash(['success' => $task->name . ' task updated']);
    } catch (Throwable $e) {
      logger($e);
      if (app()->environment() == 'local') return back()->withFlash(['error' => $e->getMessage()]);
    }
    return back()->withFlash(['error' => 'Error occurred']);
  }

  public function complete(Task $task)
  {
    try {
      $task->completed_at = now();
      $task->save();

      return redirect()->route('app.tasks.index')->withFlash(['success' => $task->name . ' task completed']);
    } catch (Throwable $e) {
      logger($e);
      if (app()->environment() == 'local') return back()->withFlash(['error' => $e->getMessage()]);
    }
    return back()->withFlash(['error' => 'Error occurred']);
  }

  public function priorities(Request $request)
  {
    if (!$request->values) abort(back()->withFlash(['error' => 'Invalid data']));

    try {
      collect($request->values)->each(function ($id, $priority) {
        Task::where('id', $id)->update(['priority' => ($priority + 1)]);
      });

      return redirect()->route('app.tasks.index')->withFlash(['success' => 'Task priorities updated!']);
    } catch (Throwable $e) {
      logger($e);
      if (app()->environment() == 'local') return back()->withFlash(['error' => $e->getMessage()]);
    }
    return back()->withFlash(['error' => 'Error occurred']);
  }

  public function delete(Task $task)
  {
    $task->forceDelete();

    return back()->withFlash(['success' => 'Task deleted']);
  }

  private function sanitizeData(array $data)
  {
    $filters = [
      'name' => 'trim|escape|capitalize',
      'priority' => 'digit',
    ];
    return (new Sanitizer($data, $filters))->sanitize();
  }

  private function validateData(array $data)
  {
    return Validator::make($data, [
      'name' => 'required|string|max:70',
      'priority' => 'required|numeric',
      'project_id' => 'required|exists:projects,id',
    ])->validate();
  }
}
