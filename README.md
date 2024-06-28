# Domain Name Generator

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
