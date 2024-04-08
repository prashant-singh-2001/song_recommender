#!/bin/bash

# Start Docker Compose in detached mode
docker-compose up --build -d

# Wait for the service to be up
sleep 10

# Open URL in default web browser
if [[ "$(uname)" == "Darwin" ]]; then
    open "http://localhost:3000/"
elif [[ "$(expr substr $(uname -s) 1 5)" == "Linux" ]]; then
    xdg-open "http://localhost:3000/"
else
    echo "Unsupported operating system"
fi

read -p "Press [Enter] to exit..."
