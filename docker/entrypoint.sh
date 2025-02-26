#!/bin/sh
set -e

if [ "$NODE_ENV" = "production" ]; then
  exec npm run start
else
  exec npm run dev
fi
