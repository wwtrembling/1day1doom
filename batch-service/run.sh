#!/bin/bash
echo "Starting Career Evolution Tree generator..."

if [ -f .env ]; then
    export $(cat .env | xargs)
fi

python generator.py "$@"
echo "Done."
