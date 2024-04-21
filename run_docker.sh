#!/bin/bash

# Script to build and run MarketPlace Service Docker container

# Stop on any error
set -e

# Check if docker-compose is installed
if ! [ -x "$(command -v docker-compose)" ]; then
  echo "Error: docker-compose is not installed." >&2
  exit 1
fi

# Build and run the container using docker-compose
echo "Building and running MarketPlace Service using Docker Compose..."
docker-compose up --build
