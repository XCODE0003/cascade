<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        {{-- SEO --}}
        @php($appName = config('app.name', 'Cascade'))
        @php($seoDescription = 'Cascade — матричная очередь ликвидности: прозрачное распределение, реферальные бонусы и быстрые выплаты в USDT.')
        <meta name="description" content="{{ $seoDescription }}">
        <meta name="theme-color" content="#007AFF">
        <meta name="robots" content="index, follow">
        <link rel="canonical" href="{{ url()->current() }}">

        {{-- Open Graph / social --}}
        <meta property="og:type" content="website">
        <meta property="og:site_name" content="{{ $appName }}">
        <meta property="og:title" content="{{ $appName }}">
        <meta property="og:description" content="{{ $seoDescription }}">
        <meta property="og:url" content="{{ url()->current() }}">
        <meta property="og:image" content="{{ asset('favicon.svg') }}">
        <meta name="twitter:card" content="summary">
        <meta name="twitter:title" content="{{ $appName }}">
        <meta name="twitter:description" content="{{ $seoDescription }}">

        {{-- Apply saved theme before paint to avoid a flash. --}}
        <script>
            (function () {
                try {
                    var a = localStorage.getItem('appearance') || 'light';
                    var dark = a === 'dark' || (a === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
                    if (dark) document.documentElement.classList.add('dark');
                } catch (e) {}
            })();
        </script>
        <style>
            html {
                background-color: #fbfbfd;
            }
            html.dark {
                background-color: #000000;
            }
        </style>

        <link rel="icon" href="/favicon.ico" sizes="any">
        <link rel="icon" href="/favicon.svg" type="image/svg+xml">
        <link rel="apple-touch-icon" href="/apple-touch-icon.png">

        @fonts

        @vite(['resources/css/app.css', 'resources/js/app.ts', "resources/js/pages/{$page['component']}.vue"])
        <x-inertia::head>
            <title>{{ config('app.name', 'Cascade') }}</title>
        </x-inertia::head>
    </head>
    <body class="font-sans antialiased">
        <x-inertia::app />
    </body>
</html>
