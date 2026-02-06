#!/bin/bash

# Git Secrets Setup Script
# This script helps prevent accidentally committing credentials to the repository
# Run this script once to set up git-secrets for this repository

set -e

echo "=================================="
echo "Git Secrets Setup"
echo "=================================="
echo ""

# Check if git-secrets is installed
if ! command -v git-secrets &> /dev/null; then
    echo "git-secrets is not installed."
    echo ""
    echo "Installing git-secrets..."
    
    # Try to install git-secrets
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        if command -v brew &> /dev/null; then
            echo "Installing via Homebrew..."
            brew install git-secrets
        else
            echo "Please install Homebrew first: https://brew.sh/"
            echo "Or install git-secrets manually: https://github.com/awslabs/git-secrets"
            exit 1
        fi
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        echo "Cloning and installing git-secrets..."
        cd /tmp
        git clone https://github.com/awslabs/git-secrets.git
        cd git-secrets
        sudo make install
        cd -
        rm -rf /tmp/git-secrets
    else
        echo "Unsupported OS. Please install git-secrets manually:"
        echo "https://github.com/awslabs/git-secrets"
        exit 1
    fi
fi

echo "git-secrets is installed ✓"
echo ""

# Install git-secrets hooks in this repository
echo "Installing git-secrets hooks in this repository..."
git secrets --install -f
echo "Git hooks installed ✓"
echo ""

# Register AWS patterns (common credential patterns)
echo "Registering AWS credential patterns..."
git secrets --register-aws
echo "AWS patterns registered ✓"
echo ""

# Add custom patterns for common secrets
echo "Adding custom secret patterns..."

# Generic API keys
git secrets --add '(api[_-]?key|apikey)[[:space:]]*[:=][[:space:]]*["\047]?[a-zA-Z0-9_\-]{20,}["\047]?'

# Generic tokens
git secrets --add '(token|auth[_-]?token|access[_-]?token)[[:space:]]*[:=][[:space:]]*["\047]?[a-zA-Z0-9_\-]{20,}["\047]?'

# Generic passwords
git secrets --add '(password|passwd|pwd)[[:space:]]*[:=][[:space:]]*["\047]?.+["\047]?'

# Generic secrets
git secrets --add '(secret|private[_-]?key)[[:space:]]*[:=][[:space:]]*["\047]?.+["\047]?'

# JWT tokens
git secrets --add 'ey[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}'

# GitHub tokens
git secrets --add 'ghp_[a-zA-Z0-9]{36}'
git secrets --add 'gho_[a-zA-Z0-9]{36}'
git secrets --add 'ghu_[a-zA-Z0-9]{36}'
git secrets --add 'ghs_[a-zA-Z0-9]{36}'
git secrets --add 'ghr_[a-zA-Z0-9]{36}'

# Slack tokens
git secrets --add 'xox[baprs]-[0-9a-zA-Z]{10,}'

# Private keys
git secrets --add -- '-----BEGIN (RSA|DSA|EC|OPENSSH) PRIVATE KEY-----'

echo "Custom patterns added ✓"
echo ""

# Add allowed patterns (to prevent false positives)
echo "Adding allowed patterns to prevent false positives..."

# Allow placeholder/example values
git secrets --add --allowed 'YOUR_API_KEY'
git secrets --add --allowed 'YOUR_TOKEN'
git secrets --add --allowed 'your-api-key-here'
git secrets --add --allowed 'example.com'
git secrets --add --allowed 'localhost'

# Allow common variable names without values
git secrets --add --allowed 'apiKey[[:space:]]*:'
git secrets --add --allowed "apiKey[[:space:]]*=[[:space:]]*['\"]?['\"]?"
git secrets --add --allowed 'process\.env\.'

echo "Allowed patterns configured ✓"
echo ""

# Test the installation
echo "Testing git-secrets configuration..."
git secrets --list
echo ""

echo "=================================="
echo "✅ Git Secrets Setup Complete!"
echo "=================================="
echo ""
echo "git-secrets will now scan commits for potential secrets."
echo "If you need to commit something that triggers a false positive,"
echo "you can use: git commit --no-verify"
echo ""
echo "To scan existing commits, run:"
echo "  git secrets --scan-history"
echo ""
echo "To manually scan files, run:"
echo "  git secrets --scan"
echo ""
