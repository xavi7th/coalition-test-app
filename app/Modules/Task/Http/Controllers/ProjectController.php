<?php

namespace App\Modules\Task\Http\Controllers;

use Throwable;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Elegant\Sanitizer\Sanitizer;
use App\Http\Controllers\Controller;
use App\Modules\Task\Models\Project;
use Illuminate\Support\Facades\Validator;
use App\Modules\Task\Transformers\ProjectResource;

class ProjectController extends Controller
{
  public function index()
  {
    return Inertia::render('Task::ManageProjects', [
      'projects' => fn() => ProjectResource::collection(Project::all()),
    ])->withViewData([
      'title' => 'Projects',
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
      $project = Project::create($this->validateData($sanitized_data));

      return redirect()->route('projects.index')->withFlash(['success' => $project->name . ' project created. Tasks can now be created under it.']);
    } catch (Throwable $e) {
      logger($e);
      if (! app()->environment('production')) return back()->withFlash(['error' => $e->getMessage()]);
    }
    return back()->withFlash(['error' => 'Project not created']);
  }

  public function update(Request $request, Project $project)
  {
    try {
      $sanitized_data  = $this->sanitizeData($request->all());
      $project->update($this->validateData($sanitized_data));

      return redirect()->route('projects.index')->withFlash(['success' => $project->name . ' project updated']);
    } catch (Throwable $e) {
      logger($e);
      if (app()->environment() == 'local') return back()->withFlash(['error' => $e->getMessage()]);
    }
    return back()->withFlash(['error' => 'Error occurred']);
  }

  public function delete(Project $project)
  {
    if ($project->tasks()->exists()) abort(403, 'This project has tasks under it and cannot be deleted!');

    $project->forceDelete();

    return back()->withFlash(['warning' => 'Project deleted']);
  }

  private function sanitizeData(array $data)
  {
    $filters = [
      'name' => 'trim|escape|capitalize',
    ];
    return (new Sanitizer($data, $filters))->sanitize();
  }

  private function validateData(array $data)
  {
    return Validator::make($data, [
      'name' => 'required|string|max:50',
    ])->validate();
  }
}
