#!/bin/sh
set -eu

: "${DB_DATABASE:=/tmp/database.sqlite}"
export DB_DATABASE

case "$DB_DATABASE" in
    /tmp/*) ;;
    *)
        echo "DB_DATABASE must point to temporary storage under /tmp." >&2
        exit 1
        ;;
esac

if [ -z "${APP_KEY:-}" ]; then
    echo "APP_KEY must be set in the Render environment." >&2
    exit 1
fi

database_directory="$(dirname "$DB_DATABASE")"
mkdir -p "$database_directory"

if [ ! -s "$DB_DATABASE" ]; then
    if [ ! -s /var/www/html/database/render-seed.db ]; then
        echo "The initial database database/render-seed.db is missing or empty." >&2
        exit 1
    fi

    cp /var/www/html/database/render-seed.db "$DB_DATABASE"
fi

chown www-data:www-data "$database_directory" "$DB_DATABASE"
chmod 0775 "$database_directory"
chmod 0664 "$DB_DATABASE"

php artisan migrate --force
php artisan config:cache

exec "$@"
