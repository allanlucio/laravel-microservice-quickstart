#!/bin/bash

#On error no such file entrypoint.sh, execute in terminal - dos2unix .docker\entrypoint.sh
npm config set cache /var/www/.npm-cache --global
cd /var/www/frontend && npm install && cd ..

cd backend
if [! -f ".env"]; then
    cp .env.example .env
fi
if [! -f ".env.testing"]; then
    cp .env.testing.example .env.testing
fi

composer install
php artisan key:generate
php artisan migrate --seed
chown -R www-data:1000 /var/www/backend/storage /var/www/backend/public /var/www/backend/app /var/www/frontend
chmod -R 775 /var/www/backend/storage /var/www/backend/public /var/www/backend/app /var/www/frontend
php-fpm
