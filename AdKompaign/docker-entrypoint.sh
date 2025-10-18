#!/bin/sh
set -e

# Ensure PHP dependencies are installed (including dev) when running in dev
if [ ! -f vendor/autoload.php ]; then
  echo "Composer dependencies not found, installing..."
  composer install --no-interaction --prefer-dist --no-scripts || composer install --no-interaction --prefer-dist --no-scripts
else
  # Keep dependencies up to date in dev
  if [ "$APP_ENV" = "dev" ]; then
    echo "Ensuring Composer dependencies are up to date (dev)..."
    composer install --no-interaction --prefer-dist --no-scripts || true
  fi
fi

# Wait for database to be ready using pg_isready
echo "Waiting for database connection..."
until pg_isready -h postgres -p 5432 -U app -d ad_kompaign > /dev/null 2>&1; do
  echo "Database not ready, waiting..."
  sleep 2
done

echo "Database connected successfully"

# Try to run migrations, show output and retry if necessary
echo "Running doctrine migrations (will retry up to 5 times on failure)..."
MAX_ATTEMPTS=5
ATTEMPT=1
until [ $ATTEMPT -gt $MAX_ATTEMPTS ]
do
  echo "Migration attempt $ATTEMPT..."
  if php bin/console doctrine:migrations:migrate --no-interaction --allow-no-migration; then
    echo "Migrations completed successfully"
    break
  else
    echo "Migration attempt $ATTEMPT failed, retrying in 3s..."
    ATTEMPT=$((ATTEMPT+1))
    sleep 3
  fi
done
if [ $ATTEMPT -gt $MAX_ATTEMPTS ]; then
  echo "Migrations failed after $MAX_ATTEMPTS attempts. Proceeding anyway (app may not work until migrations succeed)."
fi

# Start the PHP development server
exec php -S 0.0.0.0:8000 -t public