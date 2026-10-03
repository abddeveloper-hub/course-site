---
description: Add a new phase to the end of the roadmap
argument-hint: "<phase-name>"
---

# /add-phase Workflow

<objective>
Add a new phase to the end of the current roadmap.
</objective>

<process>

## 1. Validate Roadmap Exists

```powershell
if (-not (Test-Path ".gsd/ROADMAP.md")) {
    throw "ROADMAP.md required. Run /new-milestone first."
}
```

---

## 2. Determine Next Phase Number

```powershell
# Count existing phases
$phases = Select-String -Path ".gsd/ROADMAP.md" -Pattern "### Phase \d+"
$nextPhase = $phases.Count + 1
```

---

## 3. Gather Phase Information

Ask for:
- **Name** — Phase title
- **Objective** — What this phase achieves
- **Depends on** — Previous phases (usually N-1; omit if Phase 1)

---

## 4. Add to ROADMAP.md

Append (omit the `**Depends on**` line for Phase 1; only include when a preceding phase exists):
```markdown
---

### Phase {N}: {name}
**Status**: ⬜ Not Started
**Objective**: {objective}
**Depends on**: Phase {N-1} <!-- Only include if preceding phase exists; omit for Phase 1 -->

**Tasks**:
- [ ] TBD (run /plan {N} to create)

**Verification**:
- TBD
```

---

## 5. Update STATE.md

Note phase added.

---

## 6. Commit

```powershell
git add .gsd/ROADMAP.md .gsd/STATE.md
git commit -m "docs: add phase {N} - {name}"
```

---

## 7. Offer Next Steps

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 GSD ► PHASE ADDED ✓
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Phase {N}: {name}

───────────────────────────────────────────────────────

▶ NEXT

/plan {N} — Create execution plans for this phase

───────────────────────────────────────────────────────
```

</process>
