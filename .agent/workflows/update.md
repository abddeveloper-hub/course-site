---
description: Update GSD to the latest version from GitHub
---

# /update Workflow

<objective>
Update GSD for Antigravity to the latest version from GitHub.
</objective>

<process>

## 1. Check Current Version

**PowerShell:**
```powershell
if (Test-Path "CHANGELOG.md") {
    $version = Select-String -Path "CHANGELOG.md" -Pattern "## \[(\d+\.\d+\.\d+)\]" | 
        Select-Object -First 1
    Write-Output "Current version: $($version.Matches.Groups[1].Value)"
}
```

**Bash:**
```bash
if [ -f "CHANGELOG.md" ]; then
    version=$(grep -oP '## \[\K[0-9]+\.[0-9]+\.[0-9]+' CHANGELOG.md | head -1)
    echo "Current version: $version"
fi
```

---

## 2. Fetch Latest from GitHub

```bash
# Clone latest to temp directory
git clone --depth 1 https://github.com/toonight/get-shit-done-for-antigravity.git .gsd-update-temp
```

---

## 3. Compare Versions

**PowerShell:**
```powershell
$remoteVersion = Select-String -Path ".gsd-update-temp/CHANGELOG.md" -Pattern "## \[(\d+\.\d+\.\d+)\]" | 
    Select-Object -First 1

Write-Output "Remote version: $($remoteVersion.Matches.Groups[1].Value)"
```

**Bash:**
```bash
remote_version=$(grep -oP '## \[\K[0-9]+\.[0-9]+\.[0-9]+' .gsd-update-temp/CHANGELOG.md | head -1)
echo "Remote version: $remote_version"
```

**If same version:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 GSD ► ALREADY UP TO DATE ✓
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Version: {version}

No updates available.

───────────────────────────────────────────────────────
```
Exit after cleanup.

---

## 4. Show Changes

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 GSD ► UPDATE AVAILABLE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Current: {current-version}
Latest:  {remote-version}

Changes:
{Extract from CHANGELOG.md}

───────────────────────────────────────────────────────

Update now?
A) Yes — Apply updates
B) No — Cancel

───────────────────────────────────────────────────────
```

---

## 5. Apply Updates

**If user confirms:**

**PowerShell:**
```powershell
# Backup current
Copy-Item -Recurse ".agent" ".agent.backup"
Copy-Item -Recurse ".agents" ".agents.backup"
Copy-Item -Recurse ".gsd/templates" ".gsd/templates.backup"

# Prune installer-managed directories to remove files deleted upstream (preserve user's .gsd docs)
Remove-Item -Recurse -Force ".agent\*"
Remove-Item -Recurse -Force ".agents\*"
Remove-Item -Recurse -Force ".gsd\templates\*"

# Copy current upstream files
Copy-Item -Recurse -Force ".gsd-update-temp/.agent/*" ".agent/"
Copy-Item -Recurse -Force ".gsd-update-temp/.agents/*" ".agents/"
Copy-Item -Recurse -Force ".gsd-update-temp/.gsd/templates/*" ".gsd/templates/"

# Update root files
Copy-Item -Force ".gsd-update-temp/GSD-STYLE.md" "./"
Copy-Item -Force ".gsd-update-temp/CHANGELOG.md" "./"
Copy-Item -Force ".gsd-update-temp/PROJECT_RULES.md" "./"
Copy-Item -Force ".gsd-update-temp/VERSION" "./"
```

**Bash:**
```bash
# Backup current
cp -r .agent .agent.backup
cp -r .agents .agents.backup
cp -r .gsd/templates .gsd/templates.backup

# Prune installer-managed directories to remove files deleted upstream (preserve user's .gsd docs)
rm -rf .agent/*
rm -rf .agents/*
rm -rf .gsd/templates/*

# Copy current upstream files
cp -r .gsd-update-temp/.agent/* .agent/
cp -r .gsd-update-temp/.agents/* .agents/
cp -r .gsd-update-temp/.gsd/templates/* .gsd/templates/

# Update root files
cp .gsd-update-temp/GSD-STYLE.md ./
cp .gsd-update-temp/CHANGELOG.md ./
cp .gsd-update-temp/PROJECT_RULES.md ./
cp .gsd-update-temp/VERSION ./
```

---

## 6. Cleanup

**PowerShell:**
```powershell
# Validate installation before removing backups
$valid = (Test-Path ".agent") -and (Test-Path ".agents") -and (Test-Path ".gsd/templates") -and (Test-Path "VERSION")
if (-not $valid) {
    Write-Error "Update validation failed. Backups retained (.agent.backup, .agents.backup, .gsd/templates.backup) for rollback."
    exit 1
}

Remove-Item -Recurse -Force ".gsd-update-temp"
Remove-Item -Recurse -Force ".agent.backup"
Remove-Item -Recurse -Force ".agents.backup"
Remove-Item -Recurse -Force ".gsd/templates.backup"
```

**Bash:**
```bash
# Validate installation before removing backups
if [ ! -d ".agent" ] || [ ! -d ".agents" ] || [ ! -d ".gsd/templates" ] || [ ! -f "VERSION" ]; then
    echo "Error: Update validation failed. Backups retained (.agent.backup, .agents.backup, .gsd/templates.backup) for rollback." >&2
    exit 1
fi

rm -rf .gsd-update-temp
rm -rf .agent.backup
rm -rf .agents.backup
rm -rf .gsd/templates.backup
```

---

## 7. Confirm

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 GSD ► UPDATED ✓
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Updated to version {remote-version}

───────────────────────────────────────────────────────

/whats-new — See what changed

───────────────────────────────────────────────────────
```

</process>

<preserved_files>
These user files are NEVER overwritten:
- .gsd/SPEC.md
- .gsd/ROADMAP.md
- .gsd/STATE.md
- .gsd/ARCHITECTURE.md
- .gsd/STACK.md
- .gsd/DECISIONS.md
- .gsd/JOURNAL.md
- .gsd/TODO.md
- .gsd/phases/*
- .gemini/GEMINI.md
</preserved_files>
