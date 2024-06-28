"""
This module initializes the tasks package and imports necessary components.
"""

from .domain_name_generator import DomainNameGenerator
from .meta_scraper import MetaScraper
from .ollama_model_preparer import OllamaModelPreparer

# scraper = MetaScraper('./data/majestic_million.csv', 100000)
# scraper.start_processes()
