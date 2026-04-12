#!/usr/bin/env python3
"""
Script to retrieve citations from Google Scholar for a specific paper.
Usage: python scholar_citations.py
"""

import requests
from bs4 import BeautifulSoup
import time
import json
import csv
import re
from typing import List, Dict


class ScholarCitationScraper:
    def __init__(self, scholar_url: str):
        self.scholar_url = scholar_url
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        self.session = requests.Session()
        self.session.headers.update(self.headers)
    
    def get_citations(self, max_pages: int = 10) -> List[Dict]:
        """Retrieve citations from Google Scholar."""
        citations = []
        current_url = self.scholar_url
        page = 0
        
        while current_url and page < max_pages:
            print(f"Fetching page {page + 1}...")
            
            try:
                response = self.session.get(current_url, timeout=10)
                response.raise_for_status()
                
                soup = BeautifulSoup(response.content, 'html.parser')
                page_citations = self.parse_citations(soup)
                citations.extend(page_citations)
                
                print(f"Found {len(page_citations)} citations on page {page + 1}")
                
                # Check for next page link
                next_link = soup.find('a', string=lambda text: text and 'Suivant' in text)
                if next_link and 'href' in next_link.attrs:
                    current_url = 'https://scholar.google.com' + next_link['href']
                else:
                    current_url = None
                
                page += 1
                time.sleep(2)  # Rate limiting
                
            except Exception as e:
                print(f"Error on page {page + 1}: {e}")
                break
        
        return citations
    
    def parse_citations(self, soup: BeautifulSoup) -> List[Dict]:
        """Parse citation data from Google Scholar HTML."""
        citations = []
        
        # Find all citation entries
        citation_divs = soup.find_all('div', class_='gs_r gs_or gs_scl')
        
        for div in citation_divs:
            try:
                citation = {}
                
                # Title
                title_tag = div.find('h3', class_='gs_rt')
                if title_tag:
                    title_link = title_tag.find('a')
                    if title_link:
                        citation['title'] = title_link.get_text(strip=True)
                        citation['url'] = title_link.get('href', '')
                    else:
                        citation['title'] = title_tag.get_text(strip=True)
                        citation['url'] = ''
                
                # Authors and publication info
                author_div = div.find('div', class_='gs_a')
                if author_div:
                    authors_text = author_div.get_text(strip=True)
                    # Fix missing spaces after commas
                    authors_text = re.sub(r',(?=[^\s])', ', ', authors_text)
                    # Fix missing spaces around dashes
                    authors_text = re.sub(r'-(?=[^\s])', '- ', authors_text)
                    authors_text = re.sub(r'(?<=[^\s])-', ' -', authors_text)
                    citation['authors_pub'] = authors_text
                
                # Snippet/abstract
                snippet_div = div.find('div', class_='gs_rs')
                if snippet_div:
                    citation['snippet'] = snippet_div.get_text(strip=True)
                
                # Citation count (if available)
                cite_links = div.find_all('a')
                for link in cite_links:
                    if 'Citer' in link.get_text():
                        citation['cite_link'] = link.get('href', '')
                        break
                
                if citation:
                    citations.append(citation)
                    
            except Exception as e:
                print(f"Error parsing citation: {e}")
                continue
        
        return citations
    
    def save_to_json(self, citations: List[Dict], filename: str = 'citations.json'):
        """Save citations to JSON file."""
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(citations, f, ensure_ascii=False, indent=2)
        print(f"Saved {len(citations)} citations to {filename}")
    
    def save_to_csv(self, citations: List[Dict], filename: str = 'citations.csv'):
        """Save citations to CSV file."""
        if not citations:
            print("No citations to save")
            return
        
        fieldnames = ['title', 'authors_pub', 'snippet', 'url', 'cite_link']
        
        with open(filename, 'w', encoding='utf-8', newline='') as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            for citation in citations:
                # Only include fields that exist
                row = {k: citation.get(k, '') for k in fieldnames}
                writer.writerow(row)
        
        print(f"Saved {len(citations)} citations to {filename}")


def main():
    # URL for OptimalControl.jl paper citations
    scholar_url = "https://scholar.google.com/scholar?cites=1899455738170204200"
    
    print("Starting Google Scholar citation scraper...")
    print(f"Target URL: {scholar_url}")
    
    scraper = ScholarCitationScraper(scholar_url)
    citations = scraper.get_citations(max_pages=5)
    
    print(f"\nTotal citations retrieved: {len(citations)}")
    
    # Save results
    scraper.save_to_json(citations)
    scraper.save_to_csv(citations)
    
    # Print first few citations
    print("\nFirst 3 citations:")
    for i, citation in enumerate(citations[:3], 1):
        print(f"\n{i}. {citation.get('title', 'N/A')}")
        print(f"   {citation.get('authors_pub', 'N/A')}")


if __name__ == "__main__":
    main()
