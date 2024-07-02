# Full Stack Application Documentation

## Overview

This is a full stack application designed to provide a seamless user experience for generating domain names using advanced AI models. The application consists of a frontend, backend, and an AI service for domain name suggestions.

## Features

- **Domain Name Generation**: Generate creative and diverse domain names based on user input.
- **Customizable Prompts**: Tailor the domain name suggestions according to specific criteria such as style, length, and keywords.
- **AI Integration**: Utilizes advanced natural language processing to understand user queries and provide relevant responses.

## Installation

To set up the development environment for this application, it is recommended to use a `.devcontainer`. Follow the steps below to get started:

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/Gincioks/domain-generator
   cd domain-generator
   ```

2. **Open in VS Code or Cursor**:
   Ensure you have Visual Studio Code or Cursor installed along with the Docker installed.

3. **Open the Project in a Dev Container**:

   - Open the project folder in VS Code.
   - Press `Open a Remote Window` and select `Reopen in Container`.

4. **Environment Variables**:

   - Copy the `.env.example` file to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Update the `.env` file with the necessary environment variables.

5. **Install Dependencies**:

   - The dev container will automatically install the necessary dependencies for both the frontend and backend.

6. **Start the Application**:

   - Once the container is up and running, you can start the application using the following commands:

     ```bash
     # In one terminal, start the backend
     start-api

     # In another terminal, start the frontend
     start-web
     ```

## Usage

After starting the application, you can access the frontend at `http://localhost:8080` and the backend API at `http://localhost:8000`.
Swagger documentation for the API can be accessed at `http://localhost:8000/docs`.

If using Ollama, you need to create a model(download and add to ollama). This can be done in Swagger UI with /create-model.
Load model for faster generation with /load-model.

> Note: for full Ollama in Github Codespaces go to `codespaces` branch.

## Troubleshooting

- App after generation gives Completed: Refresh page and try again(model generated wrong response).

- App gives only one domain name(case for open source models): Press re-generate for more results. Next re-generations will be faster and more results will be generated.
