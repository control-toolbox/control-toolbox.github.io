# Maintenance Scripts

This folder contains scripts for maintaining the control-toolbox.org site.

## 📄 Available Scripts

### `generate_contributors_page.sh`

Generates the contributors page from GitHub data.

**Usage:**

```bash
./generate_contributors_page.sh
```

**Prerequisites:**

- Python 3.7+
- Dependencies: `requests`, `python-dotenv` (see `requirements.txt`)

**GitHub Token (optional):**

```bash
export GITHUB_TOKEN='your_token_here'
```

### `github_contributors.py`

Python script to analyze contributors from GitHub repositories.

**Usage:**

```bash
# Generate the web page
python3 github_contributors.py --web

# Generate a Markdown report
python3 github_contributors.py

# Help
python3 github_contributors.py --help
```

## 📦 Installing Dependencies

```bash
pip3 install -r requirements.txt
```

Or with `--break-system-packages` on macOS:

```bash
pip3 install --break-system-packages requests python-dotenv
```

## 🤖 Automation

The page is automatically updated every Monday via GitHub Actions.

See `.github/workflows/update_contributors.yml`.
