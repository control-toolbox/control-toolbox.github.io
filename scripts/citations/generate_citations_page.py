#!/usr/bin/env python3
"""
Script pour générer une page de citations depuis Google Scholar
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
    Génère une page web Markdown avec front matter Jekyll pour le site control-toolbox
    
    Args:
        citations: Liste des citations
        scholar_url: URL Google Scholar utilisée
        output_file: Nom du fichier de sortie
    """
    if not citations:
        print("❌ Impossible de générer la page web : aucune citation trouvée.")
        return
    
    with open(output_file, 'w', encoding='utf-8') as f:
        # Front matter Jekyll
        f.write("---\n")
        f.write("layout: default\n")
        f.write("title: Citations\n")
        f.write("permalink: /citations/\n")
        f.write("---\n\n")
        
        # Lien CSS personnalisé
        f.write('<link rel="stylesheet" href="/assets/css/citations.css">\n\n')
        
        # Conteneur principal
        f.write('<div class="citations-page">\n\n')
        
        # En-tête
        f.write('<div class="citations-header">\n')
        f.write('<h1>📚 Citations</h1>\n')
        f.write('<p class="subtitle">Academic papers citing OptimalControl.jl and related control-toolbox projects</p>\n')
        f.write(f'<p class="last-update">Last updated: {datetime.now().strftime("%B %d, %Y at %H:%M UTC")}</p>\n')
        f.write('</div>\n\n')
        
        # Carte de résumé
        f.write('<div class="summary-cards">\n')
        f.write('<div class="summary-card card-citations">\n')
        f.write('<div class="card-label">Total Citations</div>\n')
        f.write(f'<div class="card-value">{len(citations)}</div>\n')
        f.write('</div>\n')
        f.write('</div>\n\n')
        
        # Note d'information
        f.write('<div class="info-box">\n')
        f.write('<p><strong>Note:</strong> This page lists academic papers that cite OptimalControl.jl and related control-toolbox projects. Data is automatically retrieved from Google Scholar.</p>\n')
        f.write('</div>\n\n')
        
        # Liste des citations
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
            
            f.write('</div>\n')
        
        f.write('</div>\n')
        f.write('</div>\n\n')
        
        # Pied de page
        f.write('<hr>\n')
        f.write('<p style="text-align: center; color: #6a737d; font-size: 0.9rem;">\n')
        f.write('<em>🤖 This page is automatically generated from Google Scholar and updated weekly.</em>\n')
        f.write('</p>\n\n')
        
        # Fermer le conteneur
        f.write('</div>\n')
    
    print(f"\n✅ Page web générée : {output_file}")
    return output_file


def main():
    """Fonction principale"""
    
    parser = argparse.ArgumentParser(
        description="Génère une page de citations depuis Google Scholar",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Exemples d'utilisation:
  python generate_citations_page.py
  python generate_citations_page.py --url "https://scholar.google.com/scholar?cites=PAPER_ID"
  python generate_citations_page.py --max-pages 10
        """
    )
    
    parser.add_argument(
        '--url',
        type=str,
        help='URL Google Scholar pour les citations (défaut: OptimalControl.jl)'
    )
    
    parser.add_argument(
        '--max-pages',
        type=int,
        default=5,
        help='Nombre maximum de pages à récupérer (défaut: 5)'
    )
    
    parser.add_argument(
        '--output',
        type=str,
        default='about/citations.md',
        help='Nom du fichier de sortie (défaut: about/citations.md)'
    )
    
    args = parser.parse_args()
    
    # URL par défaut pour OptimalControl.jl
    if args.url:
        scholar_url = args.url
    else:
        scholar_url = "https://scholar.google.com/scholar?cites=1899455738170204200"
    
    print("\n" + "="*70)
    print("🔍 RÉCUPÉRATION DES CITATIONS")
    print("="*70)
    print(f"URL Google Scholar : {scholar_url}")
    print(f"Pages maximum : {args.max_pages}")
    print("="*70 + "\n")
    
    # Récupération des citations
    scraper = ScholarCitationScraper(scholar_url)
    citations = scraper.get_citations(max_pages=args.max_pages)
    
    print(f"\nTotal citations récupérées : {len(citations)}")
    
    if not citations:
        print("❌ Aucune citation trouvée.")
        return
    
    # Trier par année (plus récent en premier)
    citations = sort_citations_by_year(citations)
    print("✅ Citations triées par année (plus récent en premier)")
    
    # Obtenir le répertoire racine du projet (2 niveaux au-dessus du script)
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(os.path.dirname(script_dir))
    web_output = os.path.join(project_root, args.output)
    
    # Génération de la page web
    generate_web_page(citations, scholar_url, web_output)


if __name__ == "__main__":
    main()
