# Prompts for testing the domain name generator

## Test 0:

```python
prompt = 'Please suggest at least 10 domain names that fit the following criteria:\n'
prompt += f'For a business doing: ###{description}###'
prompt += f'Similar in style to: ###{", ".join(names)}###'
prompt += f'With a minimum length of: {min_domain_length}'
prompt += f'With a maximum length of: {max_domain_length}'
prompt += f'Include the following words: {", ".join(included_words)}'
prompt += f'Consider these tlds: {", ".join(tlds)}'

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
                                "description": "The best tld"
                            },
                            "explain": {
                                "type": "string",
                                "description": "A justification for why this domain is a good suggestion"
                            },
                        },
                        "required": [
                            "domain",
                            "explain",
                            "tld",
                        ]
                    }
                }
            },
            "required": ["domains"]
        }
    }
]
```

## Test N:

```python
functions = [
    {
        "name": "suggest_domains",
        "description": "Suggests a list of 10 domains that fits the above criteria",
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
                                "description": "The suggested domain without the tld",
                            },
                            "tld": {
                                "type": "string",
                                "description": "The best tld for this domain",
                            },
                            "explain": {
                                "type": "string",
                                "description": "A justification for why this domain is a good suggestion",
                            },
                            "logo_description": {
                                "type": "string",
                                "description": "A description of the logo of the domain for image generation",
                            },
                        },
                        "required": [
                            "domain",
                            "explain",
                            "tld",
                            "logo_description",
                        ],
                    },
                }
            },
            "required": ["domains"],
        },
    }
]
```

```python
prompt="<|im_start|>system\n\nYou are BrandBot, an AI assistant specialized in generating creative and diverse domain names. Your task is to help users find unique, memorable domain names for their projects or businesses.\n\nWhen generating domain names, adhere to the following guidelines:\n1. Always provide exactly 10 domain name suggestions.\n2. Offer a diverse range of name styles, including:\n- Brandable names (like Google, Rolex)\n- Evocative names (like RedBull, Forever21)\n- Compound words (like FedEx, Microsoft)\n- Short phrases (like Dollar Shave Club)\n- Alternate spellings (like Lyft, Fiverr)\n- Real words (like Apple, Amazon)\n- Non-English words (like Toyota, Audi)\n\n3. Be creative and think outside the box, while ensuring names are appropriate and marketable.\n\n4. If the user specifies a particular style or industry, tailor your suggestions accordingly.\n\n5. Always give only top-level domains\n\nRemember, your goal is to inspire and assist users in finding the perfect domain name for their brand. Be helpful, insightful, and always strive to understand the user's needs.\n\n\n# Tools\n\n## You have access to the following tools:\n\n### suggest_domains\n\nsuggest_domains: Suggests a list of domains that fits the above criteria Parameters: {\"type\": \"object\", \"properties\": {\"domains\": {\"type\": \"array\", \"items\": {\"type\": \"object\", \"properties\": {\"domain\": {\"type\": \"string\", \"description\": \"The suggested domain without the tld\"}, \"tld\": {\"type\": \"string\", \"description\": \"The best tld for this domain\"}, \"explain\": {\"type\": \"string\", \"description\": \"A justification for why this domain is a good suggestion\"}, \"logo_description\": {\"type\": \"string\", \"description\": \"A description of the logo of the domain for image generation\"}}, \"required\": [\"domain\", \"explain\", \"tld\", \"logo_description\"]}}}, \"required\": [\"domains\"]} Format the arguments as a JSON object.\n\n## When you need to call a tool, please insert the following command in your reply, which can be called zero or multiple times according to your needs:\n\n✿FUNCTION✿: The tool to use, should be one of [suggest_domains]\n✿ARGS✿: The input of the tool\n✿RESULT✿: Tool results\n✿RETURN✿: Reply based on tool results. Images need to be rendered as ![](url)<|im_end|>\n<|im_start|>user\nSuggest domain names that fit the following criteria:\nFor a business doing: ###Nexor is a cutting-edge AI chatbot that delivers tailored recommendations to boost your productivity and streamline operations. Utilizing advanced natural language processing, Nexor understands your queries and provides precise, relevant responses. Perfect for enhancing efficiency in various professional environments.###\nWith these keywords: ######\nIn style: ###brandable###\nWith a randomness of: medium\nWith a minimum length of: 1\nWith a maximum length of: 20\nConsider these tlds: com\n\n\n✿FUNCTION✿: suggest_domains<|im_end|>\n<|im_start|>assistant\n"
```
