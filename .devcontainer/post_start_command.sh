#!/bin/bash

cp .env.example .env

cd /workspaces/domain-generator/api && uvicorn main:app &
cd /workspaces/domain-generator/web && bun dev &

echo -e "\033[1;32mUse the following commands to start the services:\033[0m"
echo -e "\033[1;34m  start-api\033[0m \033[1;32m- Start the backend\033[0m"
echo -e "\033[1;34m  start-web\033[0m \033[1;32m- Start the frontend\033[0m"

