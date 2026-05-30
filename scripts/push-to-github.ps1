# EduVerse — Push to GitHub Script
# Run this script after installing GitHub CLI

# 1. Install GitHub CLI (if not already)
if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
    Write-Host "Installing GitHub CLI..." -ForegroundColor Yellow
    winget install --id GitHub.cli -e
}

# 2. Authenticate (opens browser)
Write-Host "Authenticating with GitHub..." -ForegroundColor Yellow
Write-Host "Create a token at: https://github.com/settings/tokens/new (scopes: repo, workflow)" -ForegroundColor Cyan
gh auth login

# 3. Create repo and push
Write-Host "Creating GitHub repository..." -ForegroundColor Yellow
gh repo create eduverse --public --push --source .
