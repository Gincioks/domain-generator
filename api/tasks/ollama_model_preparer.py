import requests
import json

class OllamaModelPreparer:
    """
    This class is responsible for preparing and interacting with Ollama models.
    """

    def __init__(self, model_name, host="http://localhost", port=None):
        """
        Initializes the OllamaModelPreparer with the given model name, host, and port.

        Args:
            model_name (str): The name of the model to be prepared.
            host (str): The host address of the Ollama server. Defaults to "http://localhost".
            port (int, optional): The port of the Ollama server. If None, no port is used.
        """
        self.model_name = model_name
        self.host = host
        self.port = port
        if self.port:
            self.url = f"{self.host}:{self.port}"
        else:
            self.url = f"{self.host}"

    def _construct_url(self, endpoint):
        """
        Constructs the URL for the given endpoint based on the host and port.

        Args:
            endpoint (str): The endpoint to be appended to the base URL.

        Returns:
            str: The constructed URL.
        """
        if self.port:
            return f"{self.host}:{self.port}/api/{endpoint}"
        else:
            return f"{self.host}/api/{endpoint}"
        
    @staticmethod
    def parse_modelfile(file_path):
        """
        Parses the Modelfile and returns its content as a dictionary.

        Args:
            file_path (str): The path to the Modelfile.

        Returns:
            dict: The parsed content of the Modelfile.
        """
        with open(file_path, "r") as f:
            content = f.read().strip()
        return {"modelfile": content}

    def create_model(self, model_name=None):
        """
        Creates a model on the Ollama server.
        """
        url = self._construct_url("create")
        file_path = f"models/{model_name or self.model_name}.Modelfile"
        modelfile = self.parse_modelfile(file_path)
        payload = {"name": model_name or self.model_name, **modelfile}
        response = requests.post(url, json=payload, stream=True)
        if response.status_code != 200:
            raise Exception(f"Failed to pull model: {response.text}")

        for line in response.iter_lines():
            if line:
                yield line.decode('utf-8')

    def pull_model(self, model_name=None):
        """
        Pulls the specified model from the Ollama server.

        Yields:
            str: The streamed response lines from the server.
        """
        url = self._construct_url("pull")
        payload = {"name": model_name or self.model_name}
        response = requests.post(url, json=payload, stream=True)
        if response.status_code != 200:
            raise Exception(f"Failed to pull model: {response.text}")

        for line in response.iter_lines():
            if line:
                yield line.decode('utf-8')

    def generate(self, model_name=None):
        """
        Generates using the specified model from the Ollama server.

        Yields:
            str: The streamed response lines from the server.
        """
        url = self._construct_url("generate")
        payload = {"model": model_name or self.model_name}
        response = requests.post(url, json=payload, stream=True)
        if response.status_code != 200:
            raise Exception(f"Failed to generate: {response.text}")

        for line in response.iter_lines():
            if line:
                decoded_line = line.decode('utf-8')
                yield decoded_line
                # Check if the response indicates success and update model_name
                try:
                    response_json = json.loads(decoded_line)
                    if response_json.get("done") and response_json.get("done_reason") == "load":
                        self.model_name = response_json.get("model")
                except json.JSONDecodeError:
                    continue