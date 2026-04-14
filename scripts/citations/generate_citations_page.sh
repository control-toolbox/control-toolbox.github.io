#!/bin/bash
#
# Script to generate the citations page for the control-toolbox site
# Usage: ./generate_citations_page.sh
#

set -euo pipefail

# Colors for display
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Citations Page Generator${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Check that Python 3 is installed
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python 3 is not installed${NC}"
    echo -e "${YELLOW}   Install Python 3 to continue${NC}"
    exit 1
fi

echo -e "${GREEN}✓${NC} Python 3 found: $(python3 --version)"

# Check Python dependencies
echo -e "${BLUE}Checking Python dependencies...${NC}"

# Function to check a Python module
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
    echo -e "${RED}❌ Missing dependencies: ${MISSING_DEPS[*]}${NC}"
    echo ""
    echo -e "${YELLOW}Installing dependencies...${NC}"
    echo -e "${YELLOW}Suggested command:${NC}"
    echo -e "${YELLOW}  pip3 install --break-system-packages ${MISSING_DEPS[*]}${NC}"
    echo -e "${YELLOW}or${NC}"
    echo -e "${YELLOW}  python3 -m venv venv${NC}"
    echo -e "${YELLOW}  source venv/bin/activate${NC}"
    echo -e "${YELLOW}  pip install -r $SCRIPT_DIR/requirements.txt${NC}"
    echo ""
    
    # Ask whether to install with --break-system-packages
    read -p "Do you want to install dependencies with --break-system-packages? (y/N) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        pip3 install --break-system-packages "${MISSING_DEPS[@]}"
    else
        echo -e "${RED}Installation cancelled. Please install dependencies manually.${NC}"
        exit 1
    fi
fi

echo -e "${GREEN}✓${NC} All dependencies are installed"
echo ""

# Run the Python script
echo -e "${BLUE}Generating the citations page...${NC}"
echo ""

cd "$PROJECT_ROOT"

if python3 "$SCRIPT_DIR/generate_citations_page.py"; then
    echo ""
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}✅ Page generated successfully!${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo ""
    echo -e "${BLUE}File created:${NC} $PROJECT_ROOT/about/citations.md"
    echo ""
    echo -e "${YELLOW}Next steps:${NC}"
    echo -e "  1. Check the page content"
    echo -e "  2. Test locally with Jekyll: ${BLUE}bundle exec jekyll serve${NC}"
    echo -e "  3. Commit and push changes"
    echo ""
else
    echo ""
    echo -e "${RED}========================================${NC}"
    echo -e "${RED}❌ Error during generation${NC}"
    echo -e "${RED}========================================${NC}"
    echo ""
    echo -e "${YELLOW}Check:${NC}"
    echo -e "  - That the Google Scholar URL is valid"
    echo -e "  - That you have Internet access"
    echo -e "  - The logs above for more details"
    echo ""
    exit 1
fi
