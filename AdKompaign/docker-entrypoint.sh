#!/bin/sh

# Wait for database to be ready using pg_isready
echo "Waiting for database connection..."
until pg_isready -h postgres -p 5432 -U app -d ad_kompaign > /dev/null 2>&1; do
  echo "Database not ready, waiting..."
  sleep 2
done

echo "Database connected successfully"

# Try to run migrations, skip if there are errors
echo "Checking if migrations need to be run..."
if php bin/console doctrine:migrations:migrate --no-interaction > /dev/null 2>&1; then
  echo "Migrations completed successfully"
else
  echo "Migrations failed or already executed"
fi

# Start the PHP development server
exec php -S 0.0.0.0:8000 -t public