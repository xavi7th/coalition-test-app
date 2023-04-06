<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class HomeController extends Controller
{
  public function index()
  {
    return Inertia::render('Task::Welcome')->withViewData([
      'title' => 'Welcome to Coalition Job Application Test',
      'metaDesc' => 'Coalition Job Application Test',
      'metaKeywords' => 'test-app',
      'ogUrl' => route('app.index'),
      'canonical' => route('app.index'),
    ]);
  }
}
