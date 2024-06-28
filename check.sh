#!/bin/bash

while ! curl -sf -o /dev/null http://host.docker.internal:11434; do
  echo "Waiting for Ollama server to be active..."
  sleep 1
done

echo "Ollama server is active"
model="qwen2:1.5b"
curl http://host.docker.internal:11434/api/pull -d '{
  "name": "'$model'"
}'

curl http://host.docker.internal:11434/api/generate -d '{
  "model": "'$model'"
}'