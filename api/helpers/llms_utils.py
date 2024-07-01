"""
This module provides utility functions for interacting with the OpenAI API.
"""

import os
import openai
import json5
from qwen_agent.llm import get_chat_model
from dotenv import load_dotenv

load_dotenv()

system_message = """
You are BrandBot, an AI assistant specialized in generating creative and diverse domain names. Your task is to help users find unique, memorable domain names for their projects or businesses.

When generating names, adhere to the following guidelines:
1. Always provide exactly 10 domain name suggestions.
2. Offer a diverse range of name styles, including:
- Brandable names (like Google, Rolex)
- Evocative names (like RedBull, Forever21)
- Compound words (like FedEx, Microsoft)
- Short phrases (like Dollar Shave Club)
- Alternate spellings (like Lyft, Fiverr)
- Real words (like Apple, Amazon)
- Non-English words (like Toyota, Audi)

3. For each suggestion, provide:
- The domain name
- A brief explanation of its style or reasoning
- Any relevant brand associations or connotations

4. Be creative and think outside the box, while ensuring names are appropriate and marketable.

5. If the user specifies a particular style or industry, tailor your suggestions accordingly.

6. Always give only top-level domains

Remember, your goal is to inspire and assist users in finding the perfect domain name for their brand. Be helpful, insightful, and always strive to understand the user's needs.
"""


class LLMSUtils:
    """
    OpenAI Utils
    """

    def __init__(self, base_url=None, model=None):
        if not base_url:
            raise ValueError("You must set a .env file with LLM_BASE_URL, TEXT_MODEL")

        self.base_url = f"{base_url}/v1"
        self.model = model or os.getenv("TEXT_MODEL")
        openai.api_key = os.getenv("OPENAI_API_KEY")

    def call_qwen(self, messages, functions=None, retries=3):
        llm = get_chat_model(
            {
                "model": self.model,
                "model_server": self.base_url,
                "api_key": openai.api_key,
            }
        )

        response = llm.chat(
            messages=messages,
            functions=functions,
            stream=False,
            extra_generate_cfg=dict(
                parallel_function_calls=True,  # Default: False
                function_choice=functions[0]["name"],
            ),
        )[0]

        if response.get("function_call", None):
            function_args = json5.loads(response["function_call"]["arguments"])
            return response, function_args
        elif retries > 0:
            print("response is not a function call, retrying...")
            return self.call_qwen(messages, functions, retries - 1)
        else:
            raise Exception(
                "Failed to get a valid function call response after 3 retries"
            )

    def send_function_chat_completion(self, prompt, functions, retries=3):
        """
        Send a function chat completion to OpenAI
        """
        messages = []

        if openai.api_key != "":
            messages.insert(
                0,
                {
                    "role": "system",
                    "content": system_message,
                },
            )

        messages.append({"role": "user", "content": prompt})
        try:
            response, function_args = self.call_qwen(messages, functions, retries)
            print("domains generation-----------", response)

            return response, function_args
        except Exception as e:
            print("error", e)
            if retries > 0:
                print(
                    f"domains generation failed in send_function_chat_completion, retrying... ({retries} retries left)"
                )
                return self.send_function_chat_completion(
                    prompt, functions, retries - 1
                )
            else:
                print("domains generation failed after 3 retries")
                raise e
