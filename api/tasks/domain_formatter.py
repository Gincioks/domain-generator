class DomainFormatter:
    """
    Formats the domain data into the desired structure.
    """

    @staticmethod
    def format_domain(domain, tld, explain, logo_description):
        """
        Formats a single domain entry.

        Args:
            domain (str): The domain name.
            tld (str): The top-level domain.
            explain (str): explanation for the domain name.

        Returns:
            dict: The formatted domain data.
        """
        return {
            "domain_name": domain,
            "domain_tld": tld,
            "explain": explain,
            "logo_description": logo_description,
            "label": {
                "text": None,
                "class": None
            },
            "restriction": None,
            "product": {
                "product_slug": f"domain:.{tld}",
                "price": {
                    "old": 14.99,
                    "purchase": 4.99 if tld == "com" else 9.99,
                    "discount": 66 if tld == "com" else 33,
                    "billing_period": {
                        "period": 1,
                        "period_unit": "year"
                    }
                },
                "addons": {
                    "privacy_protection": True
                }
            },
            "tooltip": None,
            "multi_year_deal": True
        }
