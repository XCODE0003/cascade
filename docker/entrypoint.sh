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

# Default SQLite database file.
: "${DB_CONNECTION:=sqlite}"
: "${DB_DATABASE:=/var/www/html/database/database.sqlite}"
if [ "$DB_CONNECTION" = "sqlite" ]; then
    touch "$DB_DATABASE" 2>/dev/null || true
fi

chown -R www-data:www-data storage bootstrap/cache 2>/dev/null || true

# Only the primary app container runs migrations/seeders so workers don't race.
if [ "$CONTAINER_ROLE" = "app" ]; then
    php artisan migrate --force --no-interaction || true
    # Seed reference data (levels, system settings, demo admin) — idempotent.
    php artisan db:seed --force --no-interaction || true
    php artisan storage:link 2>/dev/null || true
fi

# Keep config live (env-driven); clear any stale caches from the image build.
php artisan config:clear || true
php artisan route:clear || true

exec "$@"
