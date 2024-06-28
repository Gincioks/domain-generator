"""
Module for checking if a domain exists using the whois service.
"""
import whois

class DomainChecker:
    """
    A class to check if a domain exists using the whois service.
    """
    @staticmethod
    def domain_exists(domain_name):
        """
        Check if a domain exists using the whois service.

        Args:
            domain_name (str): The domain name to check.

        Returns:
            bool: True if the domain exists, False otherwise.
        """
        try:
            domain_info = whois.whois(domain_name)
            if domain_info.status:
                return True
            return False
        except whois.parser.PywhoisError:
            return False