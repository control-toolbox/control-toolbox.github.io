#!/bin/bash
#
# Script pour générer la page des contributeurs du site control-toolbox
# Usage: ./generate_contributors_page.sh
#

set -euo pipefail

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Obtenir le répertoire du script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Contributors Page Generator${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Vérifier que Python 3 est installé
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python 3 n'est pas installé${NC}"
    echo -e "${YELLOW}   Installez Python 3 pour continuer${NC}"
    exit 1
fi

echo -e "${GREEN}✓${NC} Python 3 trouvé: $(python3 --version)"

# Vérifier si le token GitHub est disponible
if [ -z "${GITHUB_TOKEN:-}" ]; then
    echo -e "${YELLOW}⚠️  Variable GITHUB_TOKEN non définie${NC}"
    echo -e "${YELLOW}   Limite API: 60 requêtes/heure${NC}"
    echo -e "${YELLOW}   Pour augmenter la limite, définissez GITHUB_TOKEN:${NC}"
    echo -e "${YELLOW}   export GITHUB_TOKEN='your_token_here'${NC}"
    echo ""
else
    echo -e "${GREEN}✓${NC} Token GitHub détecté"
    echo -e "${GREEN}   Limite API: 5000 requêtes/heure${NC}"
    echo ""
fi

# Vérifier les dépendances Python
echo -e "${BLUE}Vérification des dépendances Python...${NC}"

# Fonction pour vérifier un module Python
check_python_module() {
    python3 -c "import $1" 2>/dev/null
    return $?
}

MISSING_DEPS=()

if ! check_python_module "requests"; then
    MISSING_DEPS+=("requests")
fi

if ! check_python_module "dotenv"; then
    MISSING_DEPS+=("python-dotenv")
fi

if [ ${#MISSING_DEPS[@]} -gt 0 ]; then
    echo -e "${RED}❌ Dépendances manquantes: ${MISSING_DEPS[*]}${NC}"
    echo ""
    echo -e "${YELLOW}Installation des dépendances...${NC}"
    echo -e "${YELLOW}Commande suggérée:${NC}"
    echo -e "${YELLOW}  pip3 install --break-system-packages ${MISSING_DEPS[*]}${NC}"
    echo -e "${YELLOW}ou${NC}"
    echo -e "${YELLOW}  python3 -m venv venv${NC}"
    echo -e "${YELLOW}  source venv/bin/activate${NC}"
    echo -e "${YELLOW}  pip install -r $SCRIPT_DIR/requirements.txt${NC}"
    echo ""
    
    # Demander si on doit installer avec --break-system-packages
    read -p "Voulez-vous installer les dépendances avec --break-system-packages? (y/N) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        pip3 install --break-system-packages "${MISSING_DEPS[@]}"
    else
        echo -e "${RED}Installation annulée. Veuillez installer les dépendances manuellement.${NC}"
        exit 1
    fi
fi

echo -e "${GREEN}✓${NC} Toutes les dépendances sont installées"
echo ""

# Exécuter le script Python
echo -e "${BLUE}Génération de la page des contributeurs...${NC}"
echo ""

cd "$PROJECT_ROOT"

if python3 "$SCRIPT_DIR/github_contributors.py" --web; then
    echo ""
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}✅ Page générée avec succès !${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo ""
    echo -e "${BLUE}Fichier créé:${NC} $PROJECT_ROOT/about/contributors.md"
    echo ""
    echo -e "${YELLOW}Prochaines étapes:${NC}"
    echo -e "  1. Vérifiez le contenu de la page"
    echo -e "  2. Testez localement avec Jekyll: ${BLUE}bundle exec jekyll serve${NC}"
    echo -e "  3. Commitez et pushez les changements"
    echo ""
else
    echo ""
    echo -e "${RED}========================================${NC}"
    echo -e "${RED}❌ Erreur lors de la génération${NC}"
    echo -e "${RED}========================================${NC}"
    echo ""
    echo -e "${YELLOW}Vérifiez:${NC}"
    echo -e "  - Que le token GitHub est valide"
    echo -e "  - Que vous avez accès aux repositories"
    echo -e "  - Les logs ci-dessus pour plus de détails"
    echo ""
    exit 1
fi
