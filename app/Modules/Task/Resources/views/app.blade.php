<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
  <!-- meta tag -->
  <meta charset="utf-8">
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <title>{{ $title ?? 'Coalition Test Application'}} | {{ config('app.name') }}</title>

  <meta name="description" content="{{$metaDesc ?? 'Coalition Test Application'}}">
  <meta name="keywords" content="{{$metaKeywords ?? 'test-app'}}">
  <meta name="author" content="Ehikioya Daniel Akhile">
  <link rel="canonical" href="{{ $canonical ?? route('app.index') }}" />
  <meta name="robots" content="index, follow" />
  <!-- <meta name="format-detection" content="telephone=yes"> -->

  <meta property="og:locale" content="{{ str_replace('_', '-', app()->getLocale()) }}" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="{{ $ogUrl ?? rescue(fn() => route('app.index')) }}" />
  <meta property="og:title" content="{{ $title ?? ''}} | {{config('app.name') }}" />
  <meta property="og:description" content="{{$metaDesc ?? 'Coalition Test Application'}}" />
  <meta property="og:image" content="{{ asset($ogImg ?? '/assets/img/logo-dark.png') }}" />

  <!-- responsive tag -->
  <meta http-equiv="x-ua-compatible" content="ie=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <!-- favicon -->
  <link rel="apple-touch-icon" href="{{asset('assets/img/apple-touch-icon.png')}}">
  <link rel="shortcut icon" type="image/x-icon" href="{{asset('assets/img/fav.png')}}">

  <script src="{{ mix('assets/js/inertiajs-app-vendor.js') }}"></script>
  <script src="https://code.jquery.com/ui/1.10.4/jquery-ui.js"></script>
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <!-- Scripts -->
  <script src="{{ mix('assets/js/manifest.js') }}" defer async></script>
  <script src="{{ mix('assets/js/vendor.js') }}" defer async></script>
  <script src="{{ mix('assets/js/inertia-app.js') }}" defer></script>

  @routes()

  <!--[if lt IE 9]>
    <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
    <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->
</head>

<body class="default-home test-app">


  @inertia


  <link rel="stylesheet" href="{{ mix('assets/css/inertia-app.css') }}">

</body>

</html>
