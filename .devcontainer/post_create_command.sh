#!/bin/bash

# For .devcontainer Ollama
# cd /workspaces/domain-generator/docker
# docker-compose -f docker-compose.middleware.yaml -p ollama down
# docker system prune -a -f
# docker volume rm $(docker volume ls -q) || true
# docker-compose -f docker-compose.middleware.yaml -p ollama up -d

cd /workspaces/domain-generator/web && bun install
cd /workspaces/domain-generator/api && pip install -r requirements.txt

echo 'alias start-api="cd /workspaces/domain-generator/api && uvicorn main:app --reload"' >>~/.bashrc
echo 'alias start-web="cp /workspaces/domain-generator/.env /workspaces/domain-generator/web/.env || true && cd /workspaces/domain-generator/web && bun dev"' >>~/.bashrc
echo 'alias start-containers="cd /workspaces/domain-generator/docker && docker-compose -f docker-compose.middleware.yaml -p ollama up -d"' >>~/.bashrc

source /home/vscode/.bashrc