#!/bin/sh
set -e

cd /var/www/html

# Ensure writable runtime directories exist (storage may be a fresh volume).
mkdir -p \
    storage/framework/cache/data \
    storage/framework/sessions \
    storage/framework/views \
    storage/logs \
    storage/app/public \
    storage/app/db \
    bootstrap/cache

: "${DB_CONNECTION:=mysql}"

# SQLite (optional fallback): make sure the file exists.
if [ "$DB_CONNECTION" = "sqlite" ]; then
    : "${DB_DATABASE:=/var/www/html/database/database.sqlite}"
    touch "$DB_DATABASE" 2>/dev/null || true
fi

chown -R www-data:www-data storage bootstrap/cache 2>/dev/null || true

# Clear any caches baked during the image build before (re)caching with runtime env.
php artisan config:clear >/dev/null 2>&1 || true
php artisan route:clear >/dev/null 2>&1 || true

# Only the primary app container migrates/seeds so workers don't race. The
# migrate loop doubles as a "wait for database" gate (MySQL takes time to boot).
if [ "$CONTAINER_ROLE" = "app" ]; then
    i=0
    until php artisan migrate --force --no-interaction; do
        i=$((i + 1))
        if [ "$i" -ge 30 ]; then
            echo "Database still unavailable after retries; continuing." >&2
            break
        fi
        echo "Waiting for database... ($i)"
        sleep 3
    done

    # Reference data (levels, system settings, demo admin) — idempotent.
    php artisan db:seed --force --no-interaction || true
    php artisan storage:link 2>/dev/null || true

    # Production caches.
    php artisan config:cache >/dev/null 2>&1 || true
    php artisan route:cache >/dev/null 2>&1 || true
fi

exec "$@"
