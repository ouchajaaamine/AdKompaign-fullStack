#!/bin/bash

# Wait for database to be ready
echo "Waiting for database connection..."
until php bin/console doctrine:query:sql "SELECT 1" > /dev/null 2>&1; do
  echo "Database not ready, waiting..."
  sleep 2
done

echo "Database connected successfully"

# Check if tables are empty (check if fixtures have been loaded)
echo "Checking if tables are empty..."
# Check if campaigns table has data (simple check)
CAMPAIGN_COUNT=$(php bin/console doctrine:query:sql "SELECT COUNT(*) FROM campaign" --quiet 2>/dev/null | tail -n 1 | tr -d ' ' 2>/dev/null || echo "0")

if [ "$CAMPAIGN_COUNT" -eq 0 ]; then
  echo "Tables exist but are empty. Loading fixtures..."
  php bin/console doctrine:fixtures:load --no-interaction
  echo "SUCCESS: Fixtures loaded successfully"
  exit 0
else
  echo "SUCCESS: Tables exist and contain data ($CAMPAIGN_COUNT campaigns found)"
  exit 0
fi