"""
This module defines the FastAPI application and the endpoint for generating domain names.
"""
import os
from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse, StreamingResponse
from fastapi.openapi.docs import get_swagger_ui_html
from tasks import DomainNameGenerator, OllamaModelPreparer
from helpers import GenerateDomainsRequest, PullLLMRequest, LoadModelRequest, CreateModelRequest, stream_model, get_models_names
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="Hoostinger Domain Name Generator",
    description="This is a simple API that generates domain names based on the input parameters.",
    version="0.1.0",
    openapi_tags=[
        {
            "name": "Setup",
            "description": "Download LLM models and load default model into memory for faster response times"
        },
        {
            "name": "Generate",
            "description": "Generate domain names based on the input parameters."
        }
    ],
    redoc_url="/redoc",
    docs_url=None,
    openapi_url="/openapi.json",
    default_response_class=JSONResponse,
    default_tags=["setup"],
    default_status_codes={404: {"description": "Not found"}},
    default_summary="Generate domain names"
)

llm_wizard = OllamaModelPreparer(
    model_name=os.getenv("TEXT_MODEL") or get_models_names()[0],
    host=os.getenv("LLM_BASE_URL"),
    port=os.getenv("LLM_BASE_URL_PORT")
)


@app.get("/docs", include_in_schema=False, tags=["docs"], summary="Custom Swagger UI. Not included in OpenAPI docs")
async def custom_swagger_ui_html_github():
    return get_swagger_ui_html(
        openapi_url=app.openapi_url,
        title=f"{app.title} - Swagger UI",
        swagger_css_url="https://cdn.jsdelivr.net/gh/sungho-cho/Fastapi-Swagger-UI-Dark/assets/dark.css"
    )


@app.post("/create-model", tags=["Setup"], summary="Create a model from a modelfile")
async def create_model(request: CreateModelRequest):
    """
    Create a model from a modelfile.
    """
    return StreamingResponse(stream_model(llm_wizard.create_model, request.model), media_type="application/json")


@app.post("/pull-llm", tags=["Setup"], summary="Pull LLM model from Ollama server", response_class=StreamingResponse)
async def pull_llm(request: PullLLMRequest):
    """
    Setup the LLMs by pulling the model from the Ollama server.
    """
    return StreamingResponse(stream_model(llm_wizard.pull_model, request.model), media_type="application/json")


@app.post("/load-model", tags=["Setup"], summary="Load LLM model into memory", response_class=StreamingResponse)
async def load_model(request: LoadModelRequest):
    """
    Load LLM model into memory with streaming response.
    """
    return StreamingResponse(stream_model(llm_wizard.generate, request.model), media_type="application/json")


@app.post("/generate-by-description", tags=["Generate"], summary="Generate domain names")
async def generate_domains(request: GenerateDomainsRequest):
    """
    Generates domain names based on the input parameters.
    """
    generator = DomainNameGenerator(
        base_url=llm_wizard.url,
        model=llm_wizard.model_name,  # latest loaded model
        keywords=request.keywords,
        style=request.style,
        number_of_domains=request.number_of_domains,
        description=request.description,
        min_domain_length=request.min_domain_length,
        max_domain_length=request.max_domain_length,
        included_words=request.included_words,
        tlds=request.tlds
    )

    try:
        domain_results = generator.run()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e

    return {"domains": domain_results}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
