#!/bin/sh
set -e

echo "Running database migrations..."
npx knex migrate:latest

echo "Starting server..."
exec node dist/server.js
