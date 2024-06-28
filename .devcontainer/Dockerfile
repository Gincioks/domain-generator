FROM mcr.microsoft.com/devcontainers/python:3.11

# [Optional] Uncomment this section to install additional OS packages.
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends libmpc-dev ffmpeg
RUN pip install --upgrade pip
