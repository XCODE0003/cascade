# syntax=docker/dockerfile:1

# ---------- Build stage: PHP deps + compiled frontend ----------
FROM php:8.4-cli-bookworm AS build

RUN apt-get update && apt-get install -y --no-install-recommends \
        git unzip ca-certificates curl gnupg \
        libzip-dev libicu-dev libonig-dev libsqlite3-dev \
    && docker-php-ext-install -j"$(nproc)" bcmath pdo_mysql pdo_sqlite zip intl \
    && rm -rf /var/lib/apt/lists/*

# Node.js 22 (Vite + Wayfinder need it; Wayfinder also needs PHP — both live here)
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y --no-install-recommends nodejs \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

# Install PHP dependencies (defer scripts/autoload until the source is present)
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-interaction --prefer-dist --no-scripts --no-autoloader

# Install JS dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Application source
COPY . .

# `npm run build` invokes `php artisan wayfinder:generate`, so a bootable app is
# required during the build. We use a throwaway .env and drop it afterwards.
RUN cp .env.example .env \
    && composer dump-autoload --optimize --no-dev \
    && php artisan key:generate \
    && npm run build \
    && rm -f .env

# ---------- App stage: php-fpm runtime ----------
FROM php:8.4-fpm-bookworm AS app

RUN apt-get update && apt-get install -y --no-install-recommends \
        libzip-dev libicu-dev libonig-dev libsqlite3-dev \
    && docker-php-ext-install -j"$(nproc)" bcmath pdo_mysql pdo_sqlite zip intl opcache \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /var/www/html

COPY --from=build /app /var/www/html

COPY docker/php/php.ini /usr/local/etc/php/conf.d/zz-app.ini
COPY docker/php/clear-env.conf /usr/local/etc/php-fpm.d/zz-clear-env.conf
COPY docker/entrypoint.sh /usr/local/bin/entrypoint

RUN chmod +x /usr/local/bin/entrypoint \
    && chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

ENTRYPOINT ["entrypoint"]
CMD ["php-fpm"]

# ---------- Web stage: nginx (static + FastCGI proxy) ----------
FROM nginx:1.27-alpine AS web

COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/public /var/www/html/public
