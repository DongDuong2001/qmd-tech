# Git Collaboration Guide for Beginners - QMD-Tech Project

This document is designed for developers who are new to Git and joining the QMD-Tech project. It provides an exhaustive, step-by-step walkthrough covering initial environment setup, daily workflows, conventional commit standards, security rules, and conflict resolution.

---

## 1. Initial Local Setup

### 1.1. Verify Git Installation
Open your terminal (PowerShell on Windows, Terminal on macOS/Linux) and run:
```bash
git --version
```
If Git is not installed on your system, download and install it from the official site: https://git-scm.com/

### 1.2. Configure Your Git Identity
Set the identity that will be attached to every commit you make:
```bash
git config --global user.name "Your Full Name"
git config --global user.email "your_email@example.com"
```
Verify your global configuration:
```bash
git config --list
```

---

## 2. Cloning the Repository and Branch Selection

### 2.1. Clone the Codebase
```bash
git clone https://github.com/DongDuong2001/qmd-tech.git
cd qmd-tech
```

### 2.2. List All Branches
Inspect all local and remote branches available on the repository:
```bash
git branch -a
```

### 2.3. Switch to the Active Development Branch
Active development is currently taking place on the `feat/real-data-admin-auth` branch:
```bash
git checkout feat/real-data-admin-auth
```
Confirm your current working branch:
```bash
git branch
```
(The branch with an asterisk `*` indicates your active branch).

---

## 3. Daily Development Workflow

Every time you begin working on a task, follow this exact 6-step sequence:

### Step 1: Pull the Latest Remote Changes
Before writing any code, always synchronize your local branch with the remote repository to avoid stale code or merge conflicts:
```bash
git pull origin feat/real-data-admin-auth
```

### Step 2: Check Modified Files
After editing or adding files, inspect your working tree status:
```bash
git status
```
Git will categorize your files:
- Changes not staged for commit (red): Modified files that are not yet queued for commit.
- Changes to be committed (green): Staged files ready to be committed.
- Untracked files: Newly created files not yet tracked by Git.

To review the exact line-by-line diffs:
```bash
git diff
```

### Step 3: Stage Specific Files (Staging Area)
CRITICAL RULE: Stage only the specific files relevant to your task. Never use `git add .` blindly.

```bash
# Stage a specific file:
git add src/app/[locale]/page.tsx

# Or stage related components:
git add src/components/layout/Header.tsx src/components/layout/Footer.tsx
```

SECURITY WARNING:
Never stage or commit `.env.local` or any files containing private keys, credentials, or secrets. If you accidentally stage it, unstage it immediately:
```bash
git restore --staged .env.local
```

### Step 4: Record Commits Using Conventional Commits Standard
Every commit must provide a concise, meaningful summary of the changes made. This project strictly enforces Conventional Commits:

Syntax:
```bash
git commit -m "type(scope): concise description"
```

Standard prefixes:
- `feat`: A new user-facing or system feature (e.g., `git commit -m "feat(auth): implement remember me functionality"`)
- `fix`: A bug fix (e.g., `git commit -m "fix(builder): correct power wattage calculation for high end gpu"`)
- `style`: Visual styling, layout, or formatting changes that do not alter logic (e.g., `git commit -m "style(home): update product card background"`)
- `refactor`: Code reorganization without adding features or fixing bugs (e.g., `git commit -m "refactor(catalog): optimize product filter query"`)
- `perf`: Performance optimizations (e.g., `git commit -m "perf(image): add explicit sizes prop to next image"`)
- `test`: Adding or updating test suites (e.g., `git commit -m "test(security): add test suite for rate limiter"`)
- `docs`: Documentation additions or revisions (e.g., `git commit -m "docs: translate git handbook into english"`)
- `chore`: Dependency upgrades or configuration file adjustments (e.g., `git commit -m "chore: update package.json dependencies"`)

### Step 5: Run Mandatory Quality Checks
Before pushing any code to GitHub, you MUST execute the four validation checks to verify that the build is completely error-free:
```bash
npm run lint
npm run typecheck
npm run test
npm run build
```
All four checks must exit with code 0 (zero errors and zero warnings).

### Step 6: Push Changes to GitHub
If working directly on the active development branch:
```bash
git push origin feat/real-data-admin-auth
```

If you created an isolated feature branch:
```bash
# Create and switch to your feature branch:
git checkout -b feat/your-feature-name

# Push and set upstream tracking:
git push -u origin feat/your-feature-name
```

---

## 4. Troubleshooting Common Scenarios

### Scenario 1: Discard Unstaged Changes in a File
If you modified a file and want to reset it back to its original state:
```bash
git restore path/to/file
```

### Scenario 2: Unstage a File Without Losing Your Edits
If you ran `git add` by mistake and want to take it out of the staging area:
```bash
git restore --staged path/to/file
```

### Scenario 3: Inspect Recent Commit History
```bash
git log --oneline -n 10
```

### Scenario 4: Resolving Merge Conflicts
If Git reports a conflict during `git pull`:
1. Open the conflicted file in your code editor (e.g., VS Code).
2. Locate the conflict markers:
   - `<<<<<<< HEAD`: Your current local changes.
   - `=======`: The conflict separator.
   - `>>>>>>> ...`: The incoming remote changes from GitHub.
3. Collaborate with your teammate to determine the correct code to keep. Remove the conflict markers.
4. Save the file and complete the merge:
   ```bash
   git add path/to/resolved-file
   git commit -m "fix: resolve merge conflict in path/to/resolved-file"
   git push origin feat/real-data-admin-auth
   ```

---

## 5. Quick Git Command Reference

| Command | Description |
| --- | --- |
| `git status` | Check working tree status (modified, staged, untracked) |
| `git pull origin <branch>` | Fetch and integrate remote changes into the current branch |
| `git add <file>` | Stage a specific file for the next commit |
| `git commit -m "..."` | Record staged changes into repository history |
| `git push origin <branch>` | Transmit local commits to the remote repository |
| `git branch` | List local branches |
| `git branch -a` | List all local and remote branches |
| `git checkout <branch>` | Switch to an existing branch |
| `git checkout -b <branch>` | Create and switch to a new branch |
| `git diff` | View unstaged line changes in your working directory |
| `git restore <file>` | Discard unstaged changes in a working tree file |
| `git log --oneline` | Display commit history in a concise single-line format |
