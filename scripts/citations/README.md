# Google Scholar Citations Scraper

This directory contains scripts to retrieve citation data from Google Scholar for specific papers.

## Scripts

### scholar_citations.py

Python script to scrape citations from Google Scholar for a specific paper.

## Usage

```bash
# Install dependencies
pip install -r requirements.txt

# Run the script
python3 scholar_citations.py
```

The script will:
- Retrieve citations from the configured Google Scholar URL
- Save results to `citations.json` and `citations.csv`
- Display the first 3 citations in the terminal

## Configuration

Edit the `scholar_url` variable in the script to change the target paper:

```python
scholar_url = "https://scholar.google.com/scholar?cites=PAPER_ID"
```

## Output

- `citations.json`: JSON file with all citation data
- `citations.csv`: CSV file with citation data for spreadsheet analysis

## Dependencies

- requests >= 2.31.0
- beautifulsoup4 >= 4.12.0
- lxml >= 4.9.0
