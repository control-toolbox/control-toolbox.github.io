#!/usr/bin/env python3
"""
Script to extract and aggregate contributors from multiple GitHub packages
"""

import requests
import argparse
import os
from collections import defaultdict
from typing import Dict, List, Tuple
from dotenv import load_dotenv

def get_contributors(repo_owner: str, repo_name: str, exclude_bots: bool = True, 
                    github_token: str = None) -> List[Tuple[str, int]]:
    """
    Retrieve the list of contributors from a GitHub repository
    
    Args:
        repo_owner: Repository owner
        repo_name: Repository name
        exclude_bots: If True, exclude bots from the list
        github_token: GitHub token to increase the rate limit
        
    Returns:
        List of tuples (contributor_name, contribution_count)
    """
    url = f"https://api.github.com/repos/{repo_owner}/{repo_name}/contributors"
    
    headers = {}
    if github_token:
        headers['Authorization'] = f'token {github_token}'
    
    try:
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        
        contributors = []
        for contributor in response.json():
            # Exclude bots if requested
            if exclude_bots and contributor['type'] != 'User':
                continue
                
            name = contributor['login']
            contributions = contributor['contributions']
            contributors.append((name, contributions))
                
        return contributors
        
    except requests.exceptions.RequestException as e:
        print(f"⚠️  Error while fetching {repo_owner}/{repo_name}: {e}")
        return []

def aggregate_contributors(packages: List[Tuple[str, str]], exclude_bots: bool = True, 
                          exclude_names: List[str] = None, github_token: str = None) -> Dict[str, int]:
    """
    Aggregate contributors from multiple packages
    
    Args:
        packages: List of tuples (owner, repo_name)
        exclude_bots: If True, exclude bots
        exclude_names: List of contributor names to exclude
        github_token: GitHub token to increase the rate limit
        
    Returns:
        Dictionary {contributor_name: total_contributions}
    """
    aggregated = defaultdict(int)
    exclude_names = exclude_names or []
    exclude_names_lower = [name.lower() for name in exclude_names]
    
    for owner, repo in packages:
        print(f"📦 Fetching contributors for {owner}/{repo}...")
        contributors = get_contributors(owner, repo, exclude_bots, github_token)
        
        for name, contributions in contributors:
            # Exclude specified names
            if name.lower() not in exclude_names_lower:
                aggregated[name] += contributions
        
        print(f"   ✓ {len(contributors)} contributor(s) found")
            
    return aggregated

def display_ranking(contributors: Dict[str, int], format_type: str = "inline"):
    """
    Display the contributor ranking in order of contributions
    
    Args:
        contributors: Dictionary {contributor_name: total_contributions}
        format_type: Format type ('inline' or 'detailed')
    """
    if not contributors:
        print("❌ No contributors found.")
        return
    
    # Sort by contribution count (descending)
    sorted_contributors = sorted(contributors.items(), key=lambda x: x[1], reverse=True)
    
    print("\n" + "="*70)
    print("📊 CONTRIBUTOR RANKING")
    print("="*70)
    
    if format_type == "inline":
        # Requested format: name1 (contribution1), name2 (contribution2)...
        ranking = ", ".join([f"{name} ({contrib})" for name, contrib in sorted_contributors])
        print(f"\n{ranking}\n")
    
    print("-"*70)
    print("📈 STATISTICS")
    print("-"*70)
    print(f"Total unique contributors: {len(sorted_contributors)}")
    print(f"Total contributions: {sum(contrib for _, contrib in sorted_contributors)}")
    
    if len(sorted_contributors) > 10:
        print(f"\n🏆 Top 10 contributors:")
        for i, (name, contrib) in enumerate(sorted_contributors[:10], 1):
            print(f"  {i:2d}. {name:<25} {contrib:>5} contributions")
    else:
        print(f"\n🏆 All contributors:")
        for i, (name, contrib) in enumerate(sorted_contributors, 1):
            print(f"  {i:2d}. {name:<25} {contrib:>5} contributions")
    
    print("="*70)

def generate_markdown_report(contributors: Dict[str, int], packages: List[Tuple[str, str]], 
                            exclude_bots: bool, exclude_names: List[str], 
                            output_file: str = "contributors_report.md"):
    """
    Generate a Markdown report with contributor statistics
    
    Args:
        contributors: Dictionary {contributor_name: total_contributions}
        packages: List of tuples (owner, repo_name)
        exclude_bots: If True, bots were excluded
        exclude_names: List of excluded names
        output_file: Output file name
    """
    from datetime import datetime
    
    if not contributors:
        print("❌ Cannot generate the report: no contributors found.")
        return
    
    sorted_contributors = sorted(contributors.items(), key=lambda x: x[1], reverse=True)
    total_contributions = sum(contrib for _, contrib in sorted_contributors)
    
    with open(output_file, 'w', encoding='utf-8') as f:
        # Header with LTeX directive
        f.write("<!-- LTeX: language=en-US -->\n")
        f.write("# GitHub Contributors Report\n\n")
        f.write(f"**Generation date:** {datetime.now().strftime('%B %d, %Y at %H:%M')}\n\n")
        
        # Summary
        f.write("## 📊 Summary\n\n")
        f.write(f"- **Repositories analyzed:** {len(packages)}\n")
        f.write(f"- **Unique contributors:** {len(sorted_contributors)}\n")
        f.write(f"- **Total contributions:** {total_contributions:,} commits\n")
        f.write(f"- **Bots excluded:** {'Yes' if exclude_bots else 'No'}\n")
        if exclude_names:
            f.write(f"- **Excluded contributors:** {', '.join(exclude_names)}\n")
        f.write("\n")
        f.write("> **Note:** Contributions correspond to commits made to the repositories.\n\n")
        
        # Inline list of contributors
        f.write("## 👥 Contributor List\n\n")
        ranking = ", ".join([f"{name} ({contrib})" for name, contrib in sorted_contributors])
        f.write(f"{ranking}\n\n")
        
        # Detailed ranking
        f.write("## 🏆 Detailed Ranking\n\n")
        f.write("| Rank | Contributor | Contributions | Percentage |\n")
        f.write("| ------ | -------------- | --------------- | ------------- |\n")
        for i, (name, contrib) in enumerate(sorted_contributors, 1):
            percentage = (contrib / total_contributions) * 100
            f.write(f"| {i} | [{name}](https://github.com/{name}) | {contrib:,} | {percentage:.1f}% |\n")
        f.write("\n")
        
        # Top contributors
        f.write("## 🌟 Top 10 Contributors\n\n")
        for i, (name, contrib) in enumerate(sorted_contributors[:10], 1):
            percentage = (contrib / total_contributions) * 100
            f.write(f"{i}. **[{name}](https://github.com/{name})** — {contrib:,} contributions ({percentage:.1f}%)\n")
        f.write("\n")
        
        # Analyzed repositories
        f.write("## 📦 Analyzed Repositories\n\n")
        
        # Group by owner
        repos_by_owner = defaultdict(list)
        for owner, repo in packages:
            repos_by_owner[owner].append(repo)
        
        for owner in sorted(repos_by_owner.keys()):
            f.write(f"### {owner}\n\n")
            for repo in sorted(repos_by_owner[owner]):
                f.write(f"- [{repo}](https://github.com/{owner}/{repo})\n")
            f.write("\n")
        
        # Additional statistics
        f.write("## 📈 Additional Statistics\n\n")
        f.write(f"- **Average contributions per contributor:** {total_contributions / len(sorted_contributors):.1f}\n")
        f.write(f"- **Median contributions:** {sorted_contributors[len(sorted_contributors)//2][1]}\n")
        
        # Distribution
        top_10_contrib = sum(contrib for _, contrib in sorted_contributors[:10])
        f.write(f"- **Top 10 contributions:** {top_10_contrib:,} ({(top_10_contrib/total_contributions)*100:.1f}%)\n")
        
        if len(sorted_contributors) > 10:
            others_contrib = total_contributions - top_10_contrib
            f.write(f"- **Other contributions:** {others_contrib:,} ({(others_contrib/total_contributions)*100:.1f}%)\n")
        
        f.write("\n")
        
        # Footer
        f.write("---\n\n")
        f.write("*Report automatically generated via the GitHub API*\n")
    
    print(f"\n✅ Markdown report generated: {output_file}")
    return output_file

def generate_web_page(contributors: Dict[str, int], packages: List[Tuple[str, str]], 
                     exclude_bots: bool, exclude_names: List[str], 
                     output_file: str = "about/contributors.md"):
    """
    Generate a Markdown web page with Jekyll front matter for the control-toolbox site
    
    Args:
        contributors: Dictionary {contributor_name: total_contributions}
        packages: List of tuples (owner, repo_name)
        exclude_bots: If True, bots were excluded
        exclude_names: List of excluded names
        output_file: Output file name
    """
    from datetime import datetime
    
    if not contributors:
        print("❌ Cannot generate the web page: no contributors found.")
        return
    
    sorted_contributors = sorted(contributors.items(), key=lambda x: x[1], reverse=True)
    total_contributions = sum(contrib for _, contrib in sorted_contributors)
    
    with open(output_file, 'w', encoding='utf-8') as f:
        # Front matter Jekyll
        f.write("---\n")
        f.write("layout: default\n")
        f.write("title: Contributors\n")
        f.write("permalink: /contributors/\n")
        f.write("---\n\n")
        
        # Custom CSS link
        f.write('<link rel="stylesheet" href="/assets/css/contributors.css">\n\n')
        
        # Main container
        f.write('<div class="contributors-page">\n\n')
        
        # Header
        f.write('<div class="contributors-header">\n')
        f.write('<h1>🌟 Contributors</h1>\n')
        f.write('<p class="subtitle">Thank you to all the amazing people who have contributed to the control-toolbox ecosystem!</p>\n')
        f.write(f'<p class="last-update">Last updated: {datetime.now().strftime("%B %d, %Y at %H:%M UTC")}</p>\n')
        f.write('</div>\n\n')
        
        # Summary cards
        f.write('<div class="summary-cards">\n')
        f.write('<div class="summary-card card-repos">\n')
        f.write('<div class="card-label">Repositories</div>\n')
        f.write(f'<div class="card-value">{len(packages)}</div>\n')
        f.write('</div>\n')
        f.write('<div class="summary-card card-contributors">\n')
        f.write('<div class="card-label">Contributors</div>\n')
        f.write(f'<div class="card-value">{len(sorted_contributors)}</div>\n')
        f.write('</div>\n')
        f.write('<div class="summary-card card-commits">\n')
        f.write('<div class="card-label">Total Commits</div>\n')
        f.write(f'<div class="card-value">{total_contributions:,}</div>\n')
        f.write('</div>\n')
        f.write('</div>\n\n')
        
        # Info note
        f.write('<div class="info-box">\n')
        f.write('<p><strong>Note:</strong> Contributions represent commits made to the repositories. ')
        if exclude_bots:
            f.write('Bots are excluded from the statistics. ')
        if exclude_names:
            f.write(f'Excluded contributors: {", ".join(exclude_names)}.')
        f.write('</p>\n')
        f.write('</div>\n\n')
        
        # Inline list of contributors
        f.write('<div class="contributors-section">\n')
        f.write('<h2>👥 All Contributors</h2>\n')
        f.write('<div class="contributors-inline">\n')
        inline_list = ", ".join([f'<span class="contributor-item"><a href="https://github.com/{name}" class="contributor-name">{name}</a> <span class="contributor-count">({contrib})</span></span>' 
                                 for name, contrib in sorted_contributors])
        f.write(f'{inline_list}\n')
        f.write('</div>\n')
        f.write('</div>\n\n')
        
        # Top 10 contributors
        f.write('<div class="contributors-section">\n')
        f.write('<h2>🏆 Top 10 Contributors</h2>\n')
        f.write('<ol class="top-contributors-list">\n')
        for i, (name, contrib) in enumerate(sorted_contributors[:10], 1):
            percentage = (contrib / total_contributions) * 100
            f.write(f'<li><a href="https://github.com/{name}" class="contributor-name">{name}</a> — ')
            f.write(f'<span class="contributor-stats">{contrib:,} contributions ({percentage:.1f}%)</span></li>\n')
        f.write('</ol>\n')
        f.write('</div>\n\n')
        
        # Detailed ranking
        f.write('<div class="contributors-section">\n')
        f.write('<h2>📊 Detailed Ranking</h2>\n')
        f.write('<table class="contributors-table">\n')
        f.write('<thead>\n')
        f.write('<tr>\n')
        f.write('<th>Rank</th>\n')
        f.write('<th>Contributor</th>\n')
        f.write('<th>Contributions</th>\n')
        f.write('<th>Percentage</th>\n')
        f.write('</tr>\n')
        f.write('</thead>\n')
        f.write('<tbody>\n')
        
        for i, (name, contrib) in enumerate(sorted_contributors, 1):
            percentage = (contrib / total_contributions) * 100
            
            # Determine badge class
            if i == 1:
                badge_class = "top-1"
            elif i == 2:
                badge_class = "top-2"
            elif i == 3:
                badge_class = "top-3"
            elif i <= 10:
                badge_class = "top-10"
            else:
                badge_class = "other"
            
            f.write('<tr>\n')
            f.write(f'<td><span class="rank-badge {badge_class}">{i}</span></td>\n')
            f.write(f'<td><a href="https://github.com/{name}" class="contributor-link">{name}</a></td>\n')
            f.write(f'<td>{contrib:,}</td>\n')
            f.write('<td>\n')
            f.write('<div class="contribution-bar">\n')
            f.write('<div class="bar-container">\n')
            f.write(f'<div class="bar-fill" style="width: {percentage}%"></div>\n')
            f.write('</div>\n')
            f.write(f'<span class="percentage-text">{percentage:.1f}%</span>\n')
            f.write('</div>\n')
            f.write('</td>\n')
            f.write('</tr>\n')
        
        f.write('</tbody>\n')
        f.write('</table>\n')
        f.write('</div>\n\n')
        
        # Additional statistics
        f.write('<div class="contributors-section">\n')
        f.write('<h2>📈 Additional Statistics</h2>\n')
        f.write('<div class="stats-grid">\n')
        
        avg_contrib = total_contributions / len(sorted_contributors)
        median_contrib = sorted_contributors[len(sorted_contributors)//2][1]
        top_10_contrib = sum(contrib for _, contrib in sorted_contributors[:10])
        top_10_percentage = (top_10_contrib / total_contributions) * 100
        
        f.write('<div class="stat-item">\n')
        f.write('<strong>Average contributions</strong>\n')
        f.write(f'<span>{avg_contrib:.1f} commits per contributor</span>\n')
        f.write('</div>\n')
        
        f.write('<div class="stat-item">\n')
        f.write('<strong>Median contributions</strong>\n')
        f.write(f'<span>{median_contrib} commits</span>\n')
        f.write('</div>\n')
        
        f.write('<div class="stat-item">\n')
        f.write('<strong>Top 10 contributions</strong>\n')
        f.write(f'<span>{top_10_contrib:,} commits ({top_10_percentage:.1f}%)</span>\n')
        f.write('</div>\n')
        
        if len(sorted_contributors) > 10:
            others_contrib = total_contributions - top_10_contrib
            others_percentage = (others_contrib / total_contributions) * 100
            f.write('<div class="stat-item">\n')
            f.write('<strong>Other contributors</strong>\n')
            f.write(f'<span>{others_contrib:,} commits ({others_percentage:.1f}%)</span>\n')
            f.write('</div>\n')
        
        f.write('</div>\n')
        f.write('</div>\n\n')
        
        # Analyzed repositories
        f.write('<div class="contributors-section">\n')
        f.write('<h2>📦 Analyzed Repositories</h2>\n')
        f.write('<div class="repo-list">\n')
        
        # Group by owner
        repos_by_owner = defaultdict(list)
        for owner, repo in packages:
            repos_by_owner[owner].append(repo)
        
        for owner in sorted(repos_by_owner.keys()):
            f.write(f'<h3>{owner}</h3>\n')
            f.write('<ul>\n')
            for repo in sorted(repos_by_owner[owner]):
                f.write(f'<li><a href="https://github.com/{owner}/{repo}">{repo}</a></li>\n')
            f.write('</ul>\n')
        
        f.write('</div>\n')
        f.write('</div>\n\n')
        
        # Footer
        f.write('<hr>\n')
        f.write('<p style="text-align: center; color: #6a737d; font-size: 0.9rem;">\n')
        f.write('<em>🤖 This page is automatically generated via the GitHub API and updated weekly.</em>\n')
        f.write('</p>\n\n')
        
        # Close container
        f.write('</div>\n')
    
    print(f"\n✅ Web page generated: {output_file}")
    return output_file

def parse_repo_list(repo_list_str: str) -> List[Tuple[str, str]]:
    """
    Parse a list of repositories in 'owner/repo' format separated by commas
    
    Args:
        repo_list_str: String containing the repos (e.g., "control-toolbox/OptimalControl.jl,control-toolbox/HamPath.jl")
        
    Returns:
        List of tuples (owner, repo_name)
    """
    packages = []
    for repo in repo_list_str.split(','):
        repo = repo.strip()
        if '/' in repo:
            owner, name = repo.split('/', 1)
            packages.append((owner.strip(), name.strip()))
        else:
            print(f"⚠️  Invalid format ignored: {repo} (expected: owner/repo)")
    return packages

def main():
    """Main function"""
    
    # Load environment variables from .env
    load_dotenv()
    
    parser = argparse.ArgumentParser(
        description="Aggregate contributors from multiple GitHub packages",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Usage examples:
  python github_contributors.py
  python github_contributors.py --repos "control-toolbox/OptimalControl.jl,control-toolbox/HamPath.jl"
  python github_contributors.py --no-bots
        """
    )
    
    parser.add_argument(
        '--repos',
        type=str,
        help='List of repositories in "owner/repo" format separated by commas'
    )
    
    parser.add_argument(
        '--no-bots',
        action='store_true',
        help='Exclude bots from statistics (enabled by default)'
    )
    
    parser.add_argument(
        '--include-bots',
        action='store_true',
        help='Include bots in the statistics'
    )
    
    parser.add_argument(
        '--exclude',
        type=str,
        help='List of contributor names to exclude, separated by commas'
    )
    
    parser.add_argument(
        '--output',
        type=str,
        default='contributors_report.md',
        help='Output Markdown file name (default: contributors_report.md)'
    )
    
    parser.add_argument(
        '--no-report',
        action='store_true',
        help='Do not generate a Markdown report'
    )
    
    parser.add_argument(
        '--web',
        action='store_true',
        help='Generate a web page for the control-toolbox site (about/contributors.md)'
    )
    
    parser.add_argument(
        '--token',
        type=str,
        help='Personal GitHub token to increase the rate limit (5000/h instead of 60/h). Can also be set via GITHUB_TOKEN in .env'
    )
    
    args = parser.parse_args()
    
    # Get the token: priority to CLI argument, otherwise environment variable
    github_token = args.token or os.getenv('GITHUB_TOKEN')
    
    # Default list of packages to analyze
    if args.repos:
        packages = parse_repo_list(args.repos)
    else:
        packages = [
            ("control-toolbox", "CTFlows.jl"),
            ("control-toolbox", "OptimalControl.jl"),
            ("control-toolbox", "ct-registry"),
            ("control-toolbox", "CTDirect.jl"),
            ("control-toolbox", "CTActions"),
            ("control-toolbox", "ProjetLong26"),
            ("control-toolbox", "CTParser.jl"),
            ("control-toolbox", "CTSolvers.jl"),
            ("control-toolbox", "CTModels.jl"),
            ("control-toolbox", "CTBase.jl"),
            ("control-toolbox", "CTBenchmarks.jl"),
            ("control-toolbox", "CTDiffFlow.jl"),
            ("control-toolbox", "OptimalControlProblems.jl"),
            ("control-toolbox", "Tutorials.jl"),
            ("control-toolbox", "CTAppTemplate.jl"),
            ("control-toolbox", "Kepler.jl"),
            ("agustinyabo", "DiauxicGrowth.jl"),
            ("control-toolbox", "GeometricPreconditioner.jl"),
            ("agustinyabo", "PWLdynamics.jl"),
            ("AnasXbouali", "SIRcontrol.jl"),
            ("control-toolbox", "LossControl.jl"),
            ("control-toolbox", "MagneticResonanceImaging.jl"),
            ("control-toolbox", "CalculusOfVariations.jl"),
            ("control-toolbox", "CTProblems.jl"),
        ]
    
    if not packages:
        print("❌ No valid package to analyze.")
        return
    
    exclude_bots = not args.include_bots
    
    # List of contributors to exclude
    exclude_names = []
    if args.exclude:
        exclude_names = [name.strip() for name in args.exclude.split(',')]
    
    print("\n" + "="*70)
    print("🔍 ANALYZING GITHUB PACKAGES")
    print("="*70)
    print(f"Packages analyzed: {len(packages)}")
    for owner, repo in packages:
        print(f"  • {owner}/{repo}")
    print(f"Excluding bots: {'Yes' if exclude_bots else 'No'}")
    if exclude_names:
        print(f"Excluded contributors: {', '.join(exclude_names)}")
    if github_token:
        print(f"Authentication: GitHub token provided (5000 req/h limit)")
    else:
        print(f"⚠️  No token: 60 req/h limit (use --token to increase)")
    print("="*70 + "\n")
    
    # Aggregate contributors
    contributors = aggregate_contributors(packages, exclude_bots, exclude_names, github_token)
    
    # Display ranking
    display_ranking(contributors)
    
    # Generate the web page
    if args.web:
        # Get project root directory (2 levels above the script)
        script_dir = os.path.dirname(os.path.abspath(__file__))
        project_root = os.path.dirname(os.path.dirname(script_dir))
        web_output = os.path.join(project_root, 'about', 'contributors.md')
        generate_web_page(contributors, packages, exclude_bots, exclude_names, web_output)
    
    # Generate the Markdown report
    if not args.no_report and not args.web:
        # Ensure the output file is in the scripts directory
        output_file = args.output
        if not output_file.startswith('/'):
            # Get the script directory
            script_dir = os.path.dirname(os.path.abspath(__file__))
            output_file = os.path.join(script_dir, output_file)
        generate_markdown_report(contributors, packages, exclude_bots, exclude_names, output_file)

if __name__ == "__main__":
    main()
