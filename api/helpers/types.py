from pydantic import BaseModel, Field
from dotenv import load_dotenv
from .get_models_names import get_models_names

load_dotenv()

models_names = get_models_names()


class CreateModelRequest(BaseModel):
    model: str = Field(
        default_factory=lambda: models_names[0],
        example=models_names[0],
        enum=models_names
    )


class PullLLMRequest(BaseModel):
    model: str = Field(
        default=models_names[0],
        example=models_names[0],
        enum=models_names
    )


class LoadModelRequest(BaseModel):
    model: str = Field(
        default=models_names[0],
        example=models_names[0],
        enum=models_names
    )


class GenerateDomainsRequest(BaseModel):
    keywords: list[str] = Field(
        default=None,
        example=["tech", "innovation", "startup"]
    )
    description: str = Field(
        default=None,
        example="A platform for innovative tech startups."
    )
    style: str = Field(
        default=None,
        example="modern"
    )
    number_of_domains: int = Field(
        default=10,
        example=10
    )
    reviewed_domains: list[str] = Field(
        default=None,
        example=[]
    )
    min_domain_length: int = Field(
        default=None,
        example=8
    )
    max_domain_length: int = Field(
        default=None,
        example=15
    )
    included_words: list[str] = Field(
        default=None,
        example=["innovate", "hub"]
    )
    tlds: list[str] = Field(
        default=None,
        example=["com"]
    )
