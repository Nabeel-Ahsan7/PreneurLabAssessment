#!/bin/sh
set -e

echo "🔄 Running database seed..."
node dist/seed.js

echo "🚀 Starting server..."
exec node dist/server.js
