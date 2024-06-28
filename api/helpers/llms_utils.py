"""
This module provides utility functions for interacting with the OpenAI API.
"""
import os
import openai
import json5
from qwen_agent.llm import get_chat_model
from dotenv import load_dotenv

load_dotenv()


class LLMSUtils:
    """
    OpenAI Utils
    """

    def __init__(self, base_url=None, model=None):
        if not base_url:
            raise ValueError(
                "You must set a .env file with LLM_BASE_URL, TEXT_MODEL")

        self.base_url = f"{base_url}/v1"
        self.model = model or os.getenv("TEXT_MODEL")
        openai.api_key = os.getenv("OPENAI_API_KEY")

    def call_qwen(self, messages, functions=None):
        llm = get_chat_model({
            'model': self.model,
            'model_server': self.base_url,
            'api_key': openai.api_key,
        })

        response = llm.chat(
            messages=messages,
            functions=functions,
            stream=False,
            extra_generate_cfg=dict(
                parallel_function_calls=True,  # Default: False
                function_choice=functions[0]['name'],
            ),
        )[0]

        if response.get('function_call', None):
            function_args = json5.loads(response['function_call']['arguments'])
            return response, function_args
        else:
            print("response is not a function call, retrying...")
            return self.call_qwen(messages, functions)

    def send_function_chat_completion(self, prompt, functions):
        """
        Send a function chat completion to OpenAI
        """
        messages = [
            {"role": "user", "content": prompt}
        ]
        try:
            response, function_args = self.call_qwen(messages, functions)
            print("domains generation-----------", response)

            return response, function_args
        except Exception:
            print("domains generation failed in send_function_chat_completion, retrying...")
            # re-call the function 3 times if the response is not a function call
            return self.send_function_chat_completion(prompt, functions)