#!/bin/bash
#
# Script pour générer la page des citations du site control-toolbox
# Usage: ./generate_citations_page.sh
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
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Citations Page Generator${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Vérifier que Python 3 est installé
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python 3 n'est pas installé${NC}"
    echo -e "${YELLOW}   Installez Python 3 pour continuer${NC}"
    exit 1
fi

echo -e "${GREEN}✓${NC} Python 3 trouvé: $(python3 --version)"

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

if ! check_python_module "bs4"; then
    MISSING_DEPS+=("beautifulsoup4")
fi

if ! check_python_module "lxml"; then
    MISSING_DEPS+=("lxml")
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
echo -e "${BLUE}Génération de la page des citations...${NC}"
echo ""

cd "$PROJECT_ROOT"

if python3 "$SCRIPT_DIR/generate_citations_page.py"; then
    echo ""
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}✅ Page générée avec succès !${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo ""
    echo -e "${BLUE}Fichier créé:${NC} $PROJECT_ROOT/about/citations.md"
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
    echo -e "  - Que l'URL Google Scholar est valide"
    echo -e "  - Que vous avez accès à Internet"
    echo -e "  - Les logs ci-dessus pour plus de détails"
    echo ""
    exit 1
fi
