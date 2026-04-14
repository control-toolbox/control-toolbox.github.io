#!/usr/bin/env python3
"""
Script to generate a citations page from Google Scholar
"""

import argparse
import os
import re
from typing import List, Dict
from datetime import datetime
from scholar_citations import ScholarCitationScraper


def extract_year(citation: Dict) -> int:
    """
    Extract year from citation authors_pub field
    
    Args:
        citation: Citation dictionary
        
    Returns:
        Year as integer, or 0 if not found
    """
    authors_pub = citation.get('authors_pub', '')
    # Try to find a 4-digit year (1900-2099)
    match = re.search(r'\b(19|20)\d{2}\b', authors_pub)
    if match:
        return int(match.group())
    return 0


def normalize_title(title: str) -> str:
    """
    Normalize a citation title for duplicate detection.
    Lowercase, keep only alphanumeric characters.
    """
    return re.sub(r'[^a-z0-9]', '', title.lower())


def extract_author_lastnames(authors_pub: str) -> frozenset:
    """
    Extract a frozenset of lowercase last names from an authors_pub string.
    Splits on the first ' - ' to isolate the author list, then takes the
    last word of each comma-separated token as the last name.
    """
    author_part = authors_pub.split(' - ')[0] if ' - ' in authors_pub else authors_pub
    lastnames = set()
    for token in author_part.split(','):
        token = token.strip().rstrip('\u2026').strip()
        if token:
            last = token.split()[-1].lower()
            last = re.sub(r'[^a-z]', '', last)
            if last:
                lastnames.add(last)
    return frozenset(lastnames)


def deduplicate_citations(citations: List[Dict]) -> List[Dict]:
    """
    Remove duplicate citations, keeping the first occurrence and storing
    alternative URLs in an 'alt_urls' list on the primary citation.
    Two citations are considered identical when their normalized titles
    and author lastname frozensets are both equal.
    """
    seen: dict = {}
    result: List[Dict] = []
    for citation in citations:
        title_key = normalize_title(citation.get('title', ''))
        authors_key = extract_author_lastnames(citation.get('authors_pub', ''))
        key = (title_key, authors_key)
        if key not in seen:
            citation = dict(citation)
            citation.setdefault('alt_urls', [])
            seen[key] = len(result)
            result.append(citation)
        else:
            alt = {
                'url': citation.get('url', ''),
                'authors_pub': citation.get('authors_pub', ''),
            }
            result[seen[key]]['alt_urls'].append(alt)
    return result


def sort_citations_by_year(citations: List[Dict]) -> List[Dict]:
    """
    Sort citations by year (most recent first)
    
    Args:
        citations: List of citation dictionaries
        
    Returns:
        Sorted list of citations
    """
    return sorted(citations, key=lambda x: extract_year(x), reverse=True)


def generate_web_page(citations: List[Dict], scholar_url: str, 
                     output_file: str = "about/citations.md"):
    """
    Generate a Markdown web page with Jekyll front matter for the control-toolbox site.
    
    Args:
        citations: List of citations
        scholar_url: Google Scholar URL used
        output_file: Output file name
    """
    if not citations:
        print("❌ Cannot generate the web page: no citations found.")
        return
    
    with open(output_file, 'w', encoding='utf-8') as f:
        # Front matter Jekyll
        f.write("---\n")
        f.write("layout: default\n")
        f.write("title: Citations\n")
        f.write("permalink: /citations/\n")
        f.write("---\n\n")
        
        # Custom CSS link
        f.write('<link rel="stylesheet" href="/assets/css/citations.css">\n\n')
        
        # Main container
        f.write('<div class="citations-page">\n\n')
        
        # Header
        f.write('<div class="citations-header">\n')
        f.write('<h1>📚 Citations</h1>\n')
        f.write('<p class="subtitle">Academic papers citing OptimalControl.jl and related control-toolbox projects</p>\n')
        f.write(f'<p class="last-update">Last updated: {datetime.now().strftime("%B %d, %Y at %H:%M UTC")}</p>\n')
        f.write('</div>\n\n')
        
        # Summary cards
        f.write('<div class="summary-cards">\n')
        f.write('<div class="summary-card card-citations">\n')
        f.write('<div class="card-label">Total Citations</div>\n')
        f.write(f'<div class="card-value">{len(citations)}</div>\n')
        f.write('</div>\n')
        f.write('</div>\n\n')
        
        # Info note
        f.write('<div class="info-box">\n')
        f.write('<p><strong>Note:</strong> This page lists academic papers that cite OptimalControl.jl and related control-toolbox projects. Data is automatically retrieved from Google Scholar.</p>\n')
        f.write('</div>\n\n')
        
        # Citations list
        f.write('<div class="citations-section">\n')
        f.write('<h2>📖 Citations</h2>\n')
        f.write('<div class="citations-list">\n')
        
        for i, citation in enumerate(citations, 1):
            f.write(f'<div class="citation-item">\n')
            
            # Title
            title = citation.get('title', 'Unknown Title')
            url = citation.get('url', '')
            if url:
                f.write(f'<h3 class="citation-title"><a href="{url}" target="_blank">{i}. {title}</a></h3>\n')
            else:
                f.write(f'<h3 class="citation-title">{i}. {title}</h3>\n')
            
            # Authors and publication
            authors_pub = citation.get('authors_pub', '')
            if authors_pub:
                f.write(f'<p class="citation-authors">{authors_pub}</p>\n')
            
            # Snippet
            snippet = citation.get('snippet', '')
            if snippet:
                f.write(f'<p class="citation-snippet">{snippet}</p>\n')
            
            # Alternate versions (duplicates merged)
            for j, alt in enumerate(citation.get('alt_urls', []), 2):
                alt_url = alt.get('url', '')
                alt_authors = alt.get('authors_pub', '')
                if alt_url:
                    f.write(f'<p class="citation-alt"><a href="{alt_url}" target="_blank">Version {j}</a>')
                    if alt_authors:
                        f.write(f' — {alt_authors}')
                    f.write('</p>\n')
            
            f.write('</div>\n')
        
        f.write('</div>\n')
        f.write('</div>\n\n')
        
        # Footer
        f.write('<hr>\n')
        f.write('<p style="text-align: center; color: #6a737d; font-size: 0.9rem;">\n')
        f.write('<em>🤖 This page is automatically generated from Google Scholar and updated weekly.</em>\n')
        f.write('</p>\n\n')
        
        # Close container
        f.write('</div>\n')
    
    print(f"\n✅ Web page generated: {output_file}")
    return output_file


def main():
    """Main function"""
    
    parser = argparse.ArgumentParser(
        description="Generate a citations page from Google Scholar",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Usage examples:
  python generate_citations_page.py
  python generate_citations_page.py --url "https://scholar.google.com/scholar?cites=PAPER_ID"
  python generate_citations_page.py --max-pages 10
        """
    )
    
    parser.add_argument(
        '--url',
        type=str,
        help='Google Scholar URL for citations (default: OptimalControl.jl)'
    )
    
    parser.add_argument(
        '--max-pages',
        type=int,
        default=5,
        help='Maximum number of pages to fetch (default: 5)'
    )
    
    parser.add_argument(
        '--output',
        type=str,
        default='about/citations.md',
        help='Output file name (default: about/citations.md)'
    )
    
    args = parser.parse_args()
    
    # Default URL for OptimalControl.jl
    if args.url:
        scholar_url = args.url
    else:
        scholar_url = "https://scholar.google.com/scholar?cites=1899455738170204200"
    
    print("\n" + "="*70)
    print("🔍 FETCHING CITATIONS")
    print("="*70)
    print(f"Google Scholar URL: {scholar_url}")
    print(f"Maximum pages: {args.max_pages}")
    print("="*70 + "\n")
    
    # Fetch citations
    scraper = ScholarCitationScraper(scholar_url)
    citations = scraper.get_citations(max_pages=args.max_pages)
    
    print(f"\nTotal citations retrieved: {len(citations)}")
    
    if not citations:
        print("❌ No citations found.")
        return
    
    # Sort by year (most recent first)
    citations = sort_citations_by_year(citations)
    print("✅ Citations sorted by year (most recent first)")
    
    # Remove duplicates
    citations_before = len(citations)
    citations = deduplicate_citations(citations)
    removed = citations_before - len(citations)
    if removed:
        print(f"✅ {removed} duplicate(s) removed ({len(citations)} unique citations)")
    else:
        print("✅ No duplicates detected")
    
    # Get project root directory (2 levels above the script)
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(os.path.dirname(script_dir))
    web_output = os.path.join(project_root, args.output)
    
    # Generate the web page
    generate_web_page(citations, scholar_url, web_output)


if __name__ == "__main__":
    main()
