"""
This script is used to scrape meta data from a list of domains and save it to a file.
It uses multiprocessing to speed up the process of scraping meta data from multiple domains.
"""
from multiprocessing import Process
import ssl
import tldextract
import urllib3
from bs4 import BeautifulSoup
import pandas as pd

ssl_context = ssl.create_default_context()
ssl_context.check_hostname = False
ssl_context.verify_mode = ssl.CERT_NONE


class MetaScraper:
    """
    This class is used to scrape meta data from a list of domains and save it to a file.
    It uses multiprocessing to speed up the process of scraping meta data from multiple domains.
    """

    def __init__(self, csv_path, domain_amount):
        self.df = pd.read_csv(csv_path)
        self.domain_amount = domain_amount
        self.increment = int(self.domain_amount / 5)
        self.req = urllib3.PoolManager(maxsize=10)
        self.headers = {
            'User-Agent':
                'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.47 Safari/537.36',
            'Accept-Language': 'en-US'}

    def fetch_meta(self, url):
        """
        This method is used to scrape meta data from a domain and return it.
        """
        try:
            res = self.req.request('GET', str(
                url), headers=self.headers, timeout=1)
            soup = BeautifulSoup(res.data, 'html.parser')
            description = soup.find(attrs={'name': 'Description'})

            if description is None:
                description = soup.find(attrs={'name': 'description'})

                if description is None:
                    print('Context is empty, pass')
                    return None

                content = description['content']
                url_clean = tldextract.extract(url)
                suffix = url_clean.suffix
                domain = url_clean.domain

                if suffix in ['com', 'org', 'ai', 'me', 'app', 'io', 'ly', 'co']:
                    print(url)
                    print(url_clean)
                    print(content)
                    meta_data = f"{content} = @ = {domain}.{suffix}\n"
                else:
                    print('Domain suffix is low priority ' + str(url))
                    return None

                return meta_data
        except (urllib3.exceptions.HTTPError, urllib3.exceptions.RequestError) as e:
            print(f"Network error: {e}")
            return None
        except AttributeError as e:
            print(f"Parsing error: {e}")
            return None
        except ssl.SSLError as e:
            print(f"SSL error: {e}")
            return None

    def worker(self, start, end, file_name):
        """
        This method is used to scrape meta data from a list of domains and save it to a file.
        """
        with open(file_name, 'w', encoding='utf-8') as meta_context:
            for x in range(start, end):
                meta_data = self.fetch_meta(self.df['Domain'][x])
                if meta_data is not None:
                    meta_context.write(meta_data)

    def start_processes(self):
        """
        This method is used to start the processes to scrape meta data from multiple domains.
        """
        processes = [
            Process(target=self.worker, args=(
                0, self.increment, './data/meta_context_1.txt')),
            Process(target=self.worker, args=(self.increment,
                    self.increment * 2, './data/meta_context_2.txt')),
            Process(target=self.worker, args=(self.increment * 2,
                    self.increment * 3, './data/meta_context_3.txt')),
            Process(target=self.worker, args=(self.increment * 3,
                    self.increment * 4, './data/meta_context_4.txt')),
            Process(target=self.worker, args=(self.increment * 4,
                    self.increment * 5, './data/meta_context_5.txt')),
        ]

        for process in processes:
            process.start()

        for process in processes:
            process.join()
