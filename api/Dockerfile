FROM php:8.3-apache

ENV PORT=10000

RUN apt-get update \
    && apt-get install -y --no-install-recommends libonig-dev libsqlite3-dev \
    && docker-php-ext-install -j"$(nproc)" mbstring opcache pdo_sqlite \
    && a2enmod headers rewrite \
    && sed -i 's/Listen 80/Listen 10000/' /etc/apache2/ports.conf \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/local/bin/composer

WORKDIR /var/www/html

COPY . .

RUN composer install \
        --classmap-authoritative \
        --no-dev \
        --no-interaction \
        --no-progress \
    && mkdir -p \
        storage/framework/cache/data \
        storage/framework/sessions \
        storage/framework/views \
        bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R ug+rwX storage bootstrap/cache \
    && test -s database/render-seed.db

COPY docker/apache-vhost.conf /etc/apache2/sites-available/000-default.conf
COPY docker/entrypoint.sh /usr/local/bin/boca-players-entrypoint

RUN chmod +x /usr/local/bin/boca-players-entrypoint

EXPOSE 10000

ENTRYPOINT ["boca-players-entrypoint"]
CMD ["apache2-foreground"]
