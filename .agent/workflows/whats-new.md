---
description: Show recent GSD changes and new features
---

# /whats-new Workflow

<objective>
Display recent changes, new features, and improvements to GSD for Antigravity.
</objective>

<process>

## 1. Read and Parse CHANGELOG.md

**PowerShell:**
```powershell
$changelog = Get-Content "CHANGELOG.md" -Raw -ErrorAction SilentlyContinue
if ($changelog -and ($changelog -match '(?ms)(## \[[^\]]+\][^\r\n]*\r?\n.*?(?=\r?\n## \[|\Z))')) {
    $latestRelease = $matches[1].Trim()
} else {
    $latestRelease = "See CHANGELOG.md for recent changes."
}
```

**Bash:**
```bash
latest_release=$(awk '/^## \[/{if (found) exit; found=1; print; next} found{print}' CHANGELOG.md 2>/dev/null || echo "See CHANGELOG.md for recent changes.")
```

## 2. Display Recent Changes

Display the parsed latest version section from CHANGELOG.md within the standard banner:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 GSD ► WHAT'S NEW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{latestRelease parsed from CHANGELOG.md}

───────────────────────────────────────────────────────

📚 Full changelog: CHANGELOG.md

───────────────────────────────────────────────────────
```

</process>

<related>
## Related

### Workflows
| Command | Relationship |
|---------|--------------|
| `/update` | Update GSD to latest version |
| `/help` | List all commands |

</related>
