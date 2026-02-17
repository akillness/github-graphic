---
description: "Set up GitHub Miner on your GitHub profile. Fully guided for complete beginners — no technical knowledge needed. Just type /project:setup and follow along."
---

You are setting up GitHub Miner on a user's GitHub profile. This animated pixel art SVG shows a miner whose underground mine evolves based on the user's GitHub commit activity. The more commits, the deeper the mine, the better the gear.

Your job is to handle EVERYTHING autonomously. The user may have zero knowledge of GitHub, git, CLI tools, or programming. Only ask the user to do things when browser-based authentication is absolutely required.

IMPORTANT: After each phase, tell the user what you just did in simple, friendly language. No jargon. Celebrate small wins.

---

# Phase 0: Check Prerequisites

## Step 0.1: Check if gh CLI is authenticated

```bash
gh auth status
```

**If authenticated:** Extract the GitHub username from the output (it appears after "Logged in to github.com account"). Store this as USERNAME for all subsequent steps.

**If NOT authenticated:** Tell the user:

> Before we start, I need you to log in to GitHub from your terminal. I'll walk you through it.
>
> 1. I'm going to run a login command — it will show a code and open your browser
> 2. In your browser, paste the code when asked
> 3. Click "Authorize" to allow access
> 4. Come back here when you see "Logged in" in the terminal

Then run:
```bash
gh auth login --web --git-protocol https
```

Wait for the user to complete browser authentication. Then verify with `gh auth status` again.

## Step 0.2: Store the username

```bash
gh api user --jq '.login'
```

Save this output as `{USERNAME}` — you will use it in every subsequent step.

---

# Phase 1: Get the Repository

The user needs their own copy of the github-graphic repository on GitHub.

## Step 1.1: Check if the user already has the repo

```bash
gh repo view {USERNAME}/github-graphic --json name 2>&1
```

**If the repo exists:** Tell the user "You already have github-graphic in your GitHub account!" and skip to Phase 2.

**If the repo does NOT exist:** Continue to Step 1.2.

## Step 1.2: Fork the repository

```bash
gh repo fork tmdgusya/github-graphic --clone=false --remote=false
```

This creates a copy under the user's GitHub account. The `--clone=false` flag means we don't download it locally — it runs entirely on GitHub's servers.

## Step 1.3: Verify the fork

```bash
gh repo view {USERNAME}/github-graphic --json name,url --jq '"Repository: \(.name)\nURL: \(.url)"'
```

Tell the user: "I've created your own copy of GitHub Miner at {URL}!"

**If this fails:** Tell the user:
> Something went wrong with the automatic fork. Let me give you a simple way to do it:
> 1. Open this link: https://github.com/tmdgusya/github-graphic/fork
> 2. Click the green "Create fork" button
> 3. Wait a few seconds for it to finish
> 4. Come back and tell me "done"

Wait for user confirmation, then verify again.

## Step 1.4: Enable GitHub Actions on the fork

GitHub disables automated workflows on forked repositories by default. We need to enable them.

```bash
gh api -X PUT repos/{USERNAME}/github-graphic/actions/permissions -f enabled=true -f allowed_actions=all
```

Verify:
```bash
gh api repos/{USERNAME}/github-graphic/actions/permissions --jq '.enabled'
```

Expected: `true`

**If the API call fails:** Tell the user:
> I need you to enable the automated updates in your browser:
> 1. Open: https://github.com/{USERNAME}/github-graphic/actions
> 2. You'll see a yellow banner — click the green button that says "I understand my workflows, go ahead and enable them"
> 3. Come back and tell me "done"

---

# Phase 2: Create a Security Token

This step REQUIRES the user's browser. Claude Code cannot create tokens because GitHub requires browser-based authentication for security.

Tell the user:

> Now I need you to create a special access key so the miner can read your GitHub activity. This is a one-time step. I'll guide you through every click.
>
> **Please open this link in your browser:**
> https://github.com/settings/tokens/new?scopes=read:user&description=github-miner
>
> You might need to enter your GitHub password or confirm with two-factor authentication.
>
> **On the page you see:**
>
> 1. **"Note"** field — it should already say "github-miner" (don't change it)
>
> 2. **"Expiration"** dropdown — I recommend selecting **"No expiration"** so your miner never stops working. If you prefer, pick a date, but the miner will stop updating when the token expires.
>
> 3. **Checkboxes** — the **"read:user"** box should already be checked (it's all we need). Don't check anything else.
>
> 4. **Scroll down** and click the green **"Generate token"** button
>
> 5. **IMPORTANT:** You'll see a code starting with `ghp_`. **Copy it right now** — GitHub will never show it again!
>
> 6. **Paste the code here** (in this chat). I'll store it securely in your repository and then forget it.

Wait for the user to provide the token.

## Step 2.1: Validate the token

When the user provides the token:

1. Check it starts with `ghp_` and is at least 30 characters long
2. If it looks wrong, tell the user: "That doesn't look quite right — the token should start with `ghp_` and be a long string of letters and numbers. Could you try copying it again?"

## Step 2.2: Verify the token works

```bash
gh api -H "Authorization: token {TOKEN}" user --jq '.login'
```

**If this returns the username:** The token works.

**If this returns a 401 error:** Tell the user "That token doesn't seem to work. It might have been copied incorrectly. Could you try creating a new one using the same link?"

**If this returns another error:** The token may not have the right permissions. Ask the user to verify the "read:user" checkbox was checked.

IMPORTANT: After verifying, do NOT display the token value in any subsequent messages.

---

# Phase 3: Store the Token Securely

## Step 3.1: Set the GH_TOKEN secret

```bash
gh secret set GH_TOKEN --repo {USERNAME}/github-graphic --body "{TOKEN}"
```

This stores the token as an encrypted secret in the repository. GitHub encrypts it — nobody can read it, not even the user.

## Step 3.2: Verify the secret was saved

```bash
gh secret list --repo {USERNAME}/github-graphic
```

Expected: A line containing `GH_TOKEN` and a date.

Tell the user: "Your security token is now safely stored. It's encrypted and only your miner can use it."

**If GH_TOKEN is not listed:** Retry Step 3.1. If it fails again, tell the user:
> I'm having trouble saving the token automatically. Let me walk you through doing it in your browser:
> 1. Open: https://github.com/{USERNAME}/github-graphic/settings/secrets/actions/new
> 2. In the "Name" field, type exactly: GH_TOKEN
> 3. In the "Secret" field, paste your token (the `ghp_...` code)
> 4. Click "Add secret"
> 5. Come back and tell me "done"

---

# Phase 4: Set Up Your Profile Page

GitHub has a special feature: if you create a repository with the same name as your username, its README shows up on your profile page. We'll use this to display your miner.

## Step 4.1: Check if the profile repository exists

```bash
gh repo view {USERNAME}/{USERNAME} --json name 2>&1
```

**If it exists:** Skip to Step 4.3.

**If it does NOT exist:** Continue to Step 4.2.

## Step 4.2: Create the profile repository

```bash
gh repo create {USERNAME}/{USERNAME} --public --add-readme --description "My GitHub profile"
```

Verify:
```bash
gh repo view {USERNAME}/{USERNAME} --json name --jq '.name'
```

Tell the user: "I created your profile page repository! This is where your miner will appear."

**If creation fails:** Tell the user:
> Let me help you create your profile page manually:
> 1. Open: https://github.com/new
> 2. For "Repository name", type your exact username: {USERNAME}
> 3. Make sure "Public" is selected
> 4. Check the box that says "Add a README file"
> 5. Click "Create repository"
> 6. Come back and tell me "done"

## Step 4.3: Check if the miner is already embedded

```bash
gh api repos/{USERNAME}/{USERNAME}/contents/README.md --jq '.content' | base64 --decode 2>/dev/null
```

Check if the output contains `github-miner.svg`.

**If the embed already exists:** Tell the user "Your miner is already on your profile page!" and skip to Phase 5.

**If the embed does NOT exist:** Continue to Step 4.4.

## Step 4.4: Detect the default branch name

```bash
gh repo view {USERNAME}/github-graphic --json defaultBranchRef --jq '.defaultBranchRef.name'
```

Store this as `{BRANCH}` (usually `master` or `main`).

Also detect the profile repo's default branch:
```bash
gh repo view {USERNAME}/{USERNAME} --json defaultBranchRef --jq '.defaultBranchRef.name'
```

Store this as `{PROFILE_BRANCH}`.

## Step 4.5: Add the miner to the profile README

Clone the profile repo to a temp directory, edit the README, and push:

```bash
gh repo clone {USERNAME}/{USERNAME} /tmp/github-miner-profile-setup
```

Read the existing README.md content from `/tmp/github-miner-profile-setup/README.md`.

Append this block at the end (preserve all existing content):

```markdown

---

## My GitHub Miner

<a href="https://github.com/{USERNAME}/github-graphic">
  <img src="https://raw.githubusercontent.com/{USERNAME}/github-graphic/{BRANCH}/github-miner.svg" alt="GitHub Miner - Level up by committing code!" width="800" />
</a>

<sub>This pixel art miner evolves as I make more commits. <a href="https://github.com/tmdgusya/github-graphic">Get your own!</a></sub>
```

Then commit and push:

```bash
cd /tmp/github-miner-profile-setup
git add README.md
git commit -m "feat: add GitHub Miner to profile"
git push
cd -
rm -rf /tmp/github-miner-profile-setup
```

## Step 4.6: Verify the embed was added

```bash
gh api repos/{USERNAME}/{USERNAME}/contents/README.md --jq '.content' | base64 --decode 2>/dev/null | grep -c "github-miner.svg"
```

Expected: `1` or more.

**If 0:** Tell the user:
> The automatic edit didn't work. Let me help you add it manually:
> 1. Open: https://github.com/{USERNAME}/{USERNAME}/edit/{PROFILE_BRANCH}/README.md
> 2. Scroll to the bottom of the text
> 3. Add a new line and paste this:
>    ```
>    ## My GitHub Miner
>    <a href="https://github.com/{USERNAME}/github-graphic">
>      <img src="https://raw.githubusercontent.com/{USERNAME}/github-graphic/{BRANCH}/github-miner.svg" alt="GitHub Miner" width="800" />
>    </a>
>    ```
> 4. Click the green "Commit changes" button
> 5. Come back and tell me "done"

---

# Phase 5: Start the Miner

## Step 5.1: Trigger the first update

```bash
gh workflow run generate.yml --repo {USERNAME}/github-graphic
```

Tell the user: "Starting your miner for the first time! This takes about 30 seconds..."

**If this fails with "could not find any workflows":** The workflow needs a trigger. Try:
```bash
gh api repos/{USERNAME}/github-graphic/actions/workflows --jq '.workflows[].name'
```

If "Generate GitHub Miner" appears, use its ID:
```bash
gh api repos/{USERNAME}/github-graphic/actions/workflows --jq '.workflows[] | select(.name=="Generate GitHub Miner") | .id'
```
Then:
```bash
gh api -X POST repos/{USERNAME}/github-graphic/actions/workflows/{WORKFLOW_ID}/dispatches -f ref="{BRANCH}"
```

If no workflows appear at all, the Actions might need a code push to activate. Make a trivial commit:
```bash
gh api repos/{USERNAME}/github-graphic/contents/README.md --jq '{content: .content, sha: .sha}' > /tmp/readme-data.json
```
This usually resolves the workflow discovery issue. Tell the user to go to `https://github.com/{USERNAME}/github-graphic/actions` and click "Run workflow" manually.

## Step 5.2: Wait and monitor

```bash
sleep 10
gh run list --repo {USERNAME}/github-graphic --limit 1 --json status,conclusion,databaseId,displayTitle
```

If `status` is `queued` or `in_progress`, wait a bit more:
```bash
sleep 20
gh run list --repo {USERNAME}/github-graphic --limit 1 --json status,conclusion,databaseId
```

## Step 5.3: Check the result

Get the run ID from the previous step, then:

```bash
gh run view {RUN_ID} --repo {USERNAME}/github-graphic --json status,conclusion --jq '"\(.status) - \(.conclusion)"'
```

**If `completed - success`:** Continue to Phase 6.

**If `completed - failure`:** Check what went wrong:
```bash
gh run view {RUN_ID} --repo {USERNAME}/github-graphic --log-failed 2>&1 | tail -30
```

Common errors and fixes:
- **"GITHUB_USERNAME and GH_TOKEN environment variables are required"** - The GH_TOKEN secret wasn't saved correctly. Go back to Phase 3.
- **"GitHub API error: 401"** - The token is invalid or doesn't have the right permissions. Go back to Phase 2.
- **"GitHub API error: 403"** - Rate limiting. Wait 5 minutes and retry.

---

# Phase 6: Verify & Celebrate!

## Step 6.1: Verify the SVG was generated

```bash
gh api repos/{USERNAME}/github-graphic/contents/github-miner.svg --jq '.size'
```

Expected: A number greater than 50000 (the SVG is typically 500KB-1.5MB).

## Step 6.2: Verify the raw URL works

```bash
curl -s -o /dev/null -w "%{http_code}" "https://raw.githubusercontent.com/{USERNAME}/github-graphic/{BRANCH}/github-miner.svg"
```

Expected: `200`

If `404`: The SVG hasn't been committed yet. Wait 1-2 minutes and retry — GitHub Actions may still be pushing.

## Step 6.3: Celebrate!

Tell the user:

> **Your GitHub Miner is live!**
>
> Open your profile to see it: **https://github.com/{USERNAME}**
>
> Your miner updates automatically every 6 hours. As you make more commits, your mine gets deeper and your gear upgrades:
>
> | Level | Commits | What You Get |
> |-------|---------|-------------|
> | Tier 1 | 0+ | Surface mine, wooden pickaxe |
> | Tier 2 | 250+ | Shallow mine, iron pickaxe, first gems appear |
> | Tier 3 | 1,000+ | Deep mine with lanterns, steel pickaxe, gold & gems |
> | Tier 4 | 2,500+ | Very deep mine, glowing mushrooms, diamond pickaxe |
> | Tier 5 | 5,000+ | Massive cavern, legendary gear, treasure hoard |
>
> **You don't need to do anything else — it's fully automatic!**
>
> If the image doesn't show up immediately, wait about 5 minutes — GitHub caches images and needs time to pick up new ones.

---

# Troubleshooting Guide

If the user comes back with issues, use these solutions:

## "The miner stopped updating"
1. Check if the token expired: `gh secret list --repo {USERNAME}/github-graphic`
2. Check if Actions is still enabled: `gh api repos/{USERNAME}/github-graphic/actions/permissions --jq '.enabled'`
3. Check recent runs: `gh run list --repo {USERNAME}/github-graphic --limit 5`
4. If token expired: guide user through Phase 2 and Phase 3 again.

## "The image shows a broken icon"
1. GitHub caches raw content aggressively. Wait 5 minutes.
2. Verify the raw URL returns 200: `curl -s -o /dev/null -w "%{http_code}" "https://raw.githubusercontent.com/{USERNAME}/github-graphic/{BRANCH}/github-miner.svg"`
3. If 404: check the branch name matches. Try both `master` and `main`.
4. As a workaround, the user can add `?v=1` to the image URL to bust the cache.

## "I want to change how it looks"
The miner's appearance is determined by commit count — it's a game mechanic, not customizable. The tiers are defined in `src/tiers.js`. If the user wants to customize colors or assets, they'd need to edit files in `src/assets/`.

## "GitHub Actions shows 'This workflow has been disabled'"
Go to `https://github.com/{USERNAME}/github-graphic/actions` and click the "Enable workflow" button. GitHub sometimes disables workflows on repos that haven't had recent activity.

## "My commit count seems wrong"
The GitHub API returns contributions for the **past 365 days only**, not all-time. The miner reflects your recent activity.

## "I want to remove the miner"
1. Delete the miner section from the profile README: `https://github.com/{USERNAME}/{USERNAME}/edit/{PROFILE_BRANCH}/README.md`
2. Optionally delete the github-graphic fork: `gh repo delete {USERNAME}/github-graphic --yes`
3. Optionally revoke the token: `https://github.com/settings/tokens`
