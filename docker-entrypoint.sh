#!/bin/sh
set -e

echo "Waiting for database to accept connections..."
until nc -z "$DB_HOST" 3306 2>/dev/null; do
    printf '.'
    sleep 1
done
echo " ready."

echo "Running database migrations..."
npx knex migrate:latest

echo "Starting server..."
exec node dist/server.js
