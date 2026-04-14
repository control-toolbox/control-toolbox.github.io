#!/bin/bash
#
# Script to generate the contributors page for the control-toolbox site
# Usage: ./generate_contributors_page.sh
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
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Contributors Page Generator${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Check that Python 3 is installed
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python 3 is not installed${NC}"
    echo -e "${YELLOW}   Install Python 3 to continue${NC}"
    exit 1
fi

echo -e "${GREEN}✓${NC} Python 3 found: $(python3 --version)"

# Check if GitHub token is available
if [ -z "${GITHUB_TOKEN:-}" ]; then
    echo -e "${YELLOW}⚠️  GITHUB_TOKEN variable not set${NC}"
    echo -e "${YELLOW}   API limit: 60 requests/hour${NC}"
    echo -e "${YELLOW}   To increase the limit, set GITHUB_TOKEN:${NC}"
    echo -e "${YELLOW}   export GITHUB_TOKEN='your_token_here'${NC}"
    echo ""
else
    echo -e "${GREEN}✓${NC} GitHub token detected"
    echo -e "${GREEN}   API limit: 5000 requests/hour${NC}"
    echo ""
fi

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

if ! check_python_module "dotenv"; then
    MISSING_DEPS+=("python-dotenv")
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
echo -e "${BLUE}Generating the contributors page...${NC}"
echo ""

cd "$PROJECT_ROOT"

if python3 "$SCRIPT_DIR/github_contributors.py" --web; then
    echo ""
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}✅ Page generated successfully!${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo ""
    echo -e "${BLUE}File created:${NC} $PROJECT_ROOT/about/contributors.md"
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
    echo -e "  - That the GitHub token is valid"
    echo -e "  - That you have access to the repositories"
    echo -e "  - The logs above for more details"
    echo ""
    exit 1
fi
