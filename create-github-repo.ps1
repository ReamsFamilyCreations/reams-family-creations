# Create the GitHub repo and push (run from this folder)
# First time: run "gh auth login" and complete the browser sign-in for ReamsFamilyCreations.

$repoName = "reams-family-creations"
Write-Host "Creating repo $repoName under ReamsFamilyCreations and pushing..." -ForegroundColor Cyan
gh repo create ReamsFamilyCreations/$repoName --public --source=. --remote=origin --push
if ($LASTEXITCODE -eq 0) {
    Write-Host "`nDone. Enable GitHub Pages: Repo -> Settings -> Pages -> Source: main, / (root) -> Save" -ForegroundColor Green
    Write-Host "Site URL: https://reamsfamilycreations.github.io/$repoName/" -ForegroundColor Green
}
