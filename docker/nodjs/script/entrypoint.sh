#!/bin/sh

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
  npm install --prefix /usr/src/app
fi

# Start the application
npm run dev --prefix /usr/src/app