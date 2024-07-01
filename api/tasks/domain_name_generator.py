"""
This module contains the DomainNameGenerator class which generates domain names
based on given criteria and checks their availability.
"""
import json
from helpers import LLMSUtils
from .domain_checker import DomainChecker
from .domain_formatter import DomainFormatter
import os


class DomainNameGenerator:
    """
    Generates domain names based on given criteria and checks their availability.
    """

    def __init__(self, base_url=None, model=None, keywords=None, style=None, randomness=None, number_of_domains=10,
                 check_domains=True, description=None, min_domain_length=None, reviewed_domains=None,
                 max_domain_length=None, included_words=None, tlds=None):
        print(f"Model: {model}")
        self.keywords = keywords if keywords else []
        self.style = style
        self.randomness = randomness
        self.number_of_domains = number_of_domains
        self.check_domains = check_domains
        self.description = description
        self.reviewed_domains = reviewed_domains
        self.min_domain_length = min_domain_length
        self.max_domain_length = max_domain_length
        self.included_words = included_words if included_words else []
        self.tlds = tlds if tlds else []
        self.openai_utils = LLMSUtils(
            base_url=base_url,
            model=model
        )

    def generate_names(self):
        """
        Generates a list of domain names that fit the given criteria.
        """
        # prompt = f'Suggest at least {self.number_of_domains} domain names that fit the following criteria:\n'
        prompt = 'Suggest domain names that fit the following criteria:\n'
        prompt += f'For a business doing: ###{self.description}###\n' if self.description else ""
        prompt += (f'With these keywords: ###{", ".join(self.keywords)}###\n'
                   if self.keywords else "")
        prompt += (f'In style: ###{self.style}###\n'
                   if self.style else "")
        prompt += f'With a randomness of: {self.randomness}\n' if self.randomness else ""
        prompt += (f'With a minimum length of: {self.min_domain_length}\n'
                   if self.min_domain_length else "")
        prompt += (f'With a maximum length of: {self.max_domain_length}\n'
                   if self.max_domain_length else "")
        prompt += (f'Words, prefixes or suffixes that should be included: {", ".join(self.included_words)}\n'
                   if self.included_words else "")
        prompt += f'Consider these tlds: {", ".join(self.tlds)}\n' if self.tlds else ""
        prompt += f'DO NOT suggest these domains: {", ".join(self.reviewed_domains)}\n' if self.reviewed_domains else ""

        functions = [
            {
                "name": "suggest_domains",
                "description": "Suggests a list of domains that fits the above criteria",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "domains": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "domain": {
                                        "type": "string",
                                        "description": "The suggested domain without the tld"
                                    },
                                    "tld": {
                                        "type": "string",
                                        "description": "The best tld for this domain"
                                    },
                                    "explain": {
                                        "type": "string",
                                        "description": "A justification for why this domain is a good suggestion"
                                    },
                                    "logo_description": {
                                        "type": "string",
                                        "description": "A description of the logo of the domain for image generation"
                                    }
                                },
                                "required": [
                                    "domain",
                                    "explain",
                                    "tld",
                                    "logo_description"
                                ]
                            }
                        }
                    },
                    "required": ["domains"]
                }
            }
        ]

        response, function_args = self.openai_utils.send_function_chat_completion(
            prompt, functions)
        if response is None or function_args is None:
            print("Error: Received None from send_function_chat_completion")
            return [], []
        return response, function_args['domains']

    def check_domain_availability(self, domain):
        """
        Checks if a given domain is available.

        Args:
            domain (str): The domain name to check.

        Returns:
            bool: True if the domain exists, False otherwise.
        """
        return DomainChecker.domain_exists(domain)

    def save_input_output_to_json(self, inputs, domain_results, raw_response, filename="domain_results.json"):
        """
        Saves the input parameters and the domain results to a JSON file.
        If the file already exists, append the new results to the existing array.

        Args:
            inputs (dict): The input parameters used for generating domain names.
            domain_results (list): The formatted results of domain name suggestions and their availability.
            raw_response (str): The raw response from the LLM.
            filename (str): The name of the file to save the data. Defaults to 'domain_results.json'.
        """
        data = []
        if os.path.exists(filename):
            with open(filename, 'r') as f:
                data = json.load(f)

        data.append({
            "inputs": inputs,
            "results": domain_results,
            "raw_response": raw_response
        })

        with open(filename, 'w') as f:
            json.dump(data, f, indent=4)

    def run(self):
        """
        Runs the domain name generator and checks the availability of the generated domains.

        Returns:
            list: A list of domain names and their availability.
        """
        inputs = {
            "keywords": self.keywords,
            "style": self.style,
            "randomness": self.randomness,
            "number_of_domains": self.number_of_domains,
            "description": self.description,
            "reviewed_domains": self.reviewed_domains,
            "min_domain_length": self.min_domain_length,
            "max_domain_length": self.max_domain_length,
            "included_words": self.included_words,
            "tlds": self.tlds
        }

        raw_response, generated_domains = self.generate_names()

        domain_results = []
        raw_domain_results = []
        # TODO: Check if the domain is available for each tld and add the tld to the domain
        for suggestion in generated_domains:
            for tld in (self.tlds or ['com']):
                domain = f'{suggestion["domain"]}.{tld}'
                if self.check_domains:
                    exists = self.check_domain_availability(domain)
                else:
                    exists = None
                formatted_domain = DomainFormatter.format_domain(
                    domain, tld, suggestion["explain"], suggestion["logo_description"])
                domain_results.append(formatted_domain)
                raw_domain_results.append({
                    "domain": domain,
                    "explain": suggestion["explain"],
                    "exists": exists,
                    "logo_description": suggestion["logo_description"]
                })

        # TODO: Check if domain result lengt is less than 10, re-run the generator for the missing domains.
        self.save_input_output_to_json(inputs, domain_results, raw_response)
        return domain_results
