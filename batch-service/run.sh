#!/bin/bash
echo "Starting Doom Generator..."

# Check if .env exists
if [ -f .env ]; then
    export $(cat .env | xargs)
fi

python generator.py
echo "Done."
