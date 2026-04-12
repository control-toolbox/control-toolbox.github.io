# Scripts de maintenance

Ce dossier contient les scripts pour la maintenance du site control-toolbox.org.

## 📄 Scripts disponibles

### `generate_contributors_page.sh`

Génère la page des contributeurs à partir des données GitHub.

**Usage :**

```bash
./generate_contributors_page.sh
```

**Prérequis :**

- Python 3.7+
- Dépendances : `requests`, `python-dotenv` (voir `requirements.txt`)

**Token GitHub (optionnel) :**

```bash
export GITHUB_TOKEN='your_token_here'
```

### `github_contributors.py`

Script Python pour analyser les contributeurs des repositories GitHub.

**Usage :**

```bash
# Générer la page web
python3 github_contributors.py --web

# Générer un rapport Markdown
python3 github_contributors.py

# Aide
python3 github_contributors.py --help
```

## 📦 Installation des dépendances

```bash
pip3 install -r requirements.txt
```

Ou avec `--break-system-packages` sur macOS :

```bash
pip3 install --break-system-packages requests python-dotenv
```

## 🤖 Automatisation

La page est automatiquement mise à jour chaque lundi via GitHub Actions.

Voir `.github/workflows/update_contributors.yml`.
