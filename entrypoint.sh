#!/bin/sh
set -e

echo "Database:URL $DATABASE_URL"

if [ "$NODE_ENV" = "production" ]; then
  exec npm run start
else
  exec npm run dev
fi
