<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class RemoveCOOPHeader
{
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);
        $response->headers->remove('Cross-Origin-Opener-Policy');
        $response->headers->remove('Cross-Origin-Embedder-Policy');
        return $response;
    }
}
