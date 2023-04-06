<?php

namespace App\Http\Middleware;

use Inertia\Middleware;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;

class HandleInertiaRequests extends Middleware
{
  /**
   * The root template that's loaded on the first page visit.
   *
   * @see https://inertiajs.com/server-side-setup#root-template
   * @var string
   */
  protected $rootView = 'task::app';

  /**
   * Determines the current asset version.
   *
   * @see https://inertiajs.com/asset-versioning
   * @param  \Illuminate\Http\Request  $request
   * @return string|null
   */
  public function version(Request $request): ?string
  {
    if (file_exists($manifest = public_path('mix-manifest.json'))) {
      return md5_file($manifest);
    }

    return parent::version($request);
  }

  /**
   * Defines the props that are shared by default.
   *
   * @see https://inertiajs.com/shared-data
   * @param  \Illuminate\Http\Request  $request
   * @return array
   */
  public function share(Request $request): array
  {
    return array_merge(parent::share($request), [
      'app' => fn () => [
        'name' => config('app.name'),
        'email' => config('app.email'),
        'phone' => config('app.phone'),
        'whatsapp' => config('app.whatsapp'),
        'address' => config('app.address'),
      ],
      'appInitPath' => mix('assets/js/inertiajs-app-init.js')->__toString(),
      'isInertiaRequest' => (bool)request()->header('X-Inertia'),
      'flash' => fn () => Session::get('flash') ?? (object)[],
    ]);
  }

  public function resolveValidationErrors(Request $request): object
  {
    if (!$request->session()->has('errors') && !$request->session()->has('flash.error')) {
      return (object) [];
    }

    if ($request->session()->has('errors')) {
      return (object) collect($request->session()->get('errors')->getBags())->map(function ($bag) {
        return (object) collect($bag->messages())->map(function ($errors) {
          return $errors[0];
        })->toArray();
      })->pipe(function ($bags) use ($request) {
        if ($bags->has('default') && $request->header('x-inertia-error-bag')) {
          return [$request->header('x-inertia-error-bag') => $bags->get('default')];
        } elseif ($bags->has('default')) {
          return $bags->get('default');
        } else {
          return $bags->toArray();
        }
      });
    } elseif ($request->session()->has('flash.error')) {
      return (object) $request->session()->get('flash');
    }
  }

  public function rootView(Request $request): string
  {
    // if (Str::contains(\Route::currentRouteName(), 'app.')) {
    //   return $this->rootView;
    // }
    return $this->rootView;
  }
}
