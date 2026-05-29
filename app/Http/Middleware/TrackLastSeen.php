<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Database\Schema\Builder as SchemaBuilder;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class TrackLastSeen
{
    protected static ?array $updatableColumns = null;

    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        if ($user = $request->user()) {
            $updates = $this->buildSafeUpdates($request);

            if ($updates !== []) {
                $user->forceFill($updates)->save();
            }
        }

        return $response;
    }

    /**
     * @return array<string, mixed>
     */
    protected function buildSafeUpdates(Request $request): array
    {
        $columns = $this->updatableColumns($request);

        if ($columns === []) {
            return [];
        }

        $updates = [];

        if (in_array('last_seen_at', $columns, true)) {
            $updates['last_seen_at'] = now();
        }

        if (in_array('last_ip', $columns, true)) {
            $updates['last_ip'] = $request->ip();
        }

        return $updates;
    }

    /**
     * @return array<int, string>
     */
    protected function updatableColumns(Request $request): array
    {
        if (self::$updatableColumns !== null) {
            return self::$updatableColumns;
        }

        $connection = $request->user()?->getConnectionName();
        $table = $request->user()?->getTable();

        if ($table === null) {
            return self::$updatableColumns = [];
        }

        /** @var SchemaBuilder $schema */
        $schema = app('db')->connection($connection)->getSchemaBuilder();
        $columns = [];

        foreach (['last_seen_at', 'last_ip'] as $column) {
            if ($schema->hasColumn($table, $column)) {
                $columns[] = $column;
            }
        }

        return self::$updatableColumns = $columns;
    }
}
