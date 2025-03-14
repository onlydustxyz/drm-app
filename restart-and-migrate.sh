#!/bin/bash

# Stop Docker Compose services
echo "Stopping Docker Compose services..."
docker compose down

# Start Docker Compose services
echo "Starting Docker Compose services..."
docker compose up -d

# Wait for the database to be ready
echo "Waiting for the database to initialize..."
sleep 5

# First install tsx if not already installed
echo "Installing tsx..."
npm install --no-save tsx

# Then run migrations using the existing migrate.ts file
echo "Running migrations..."
npx tsx lib/drizzle/migrate.ts

echo "Restart and migration completed!" 