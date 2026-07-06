# SafetyGenie | Launch Tracker

A static, read-only dashboard for tracking SafetyGenie launch progress.

## How It Works

- `launch-data.json` — the single source of truth. Update this file to change what the page displays.
- `index.html` — the page shell.
- `app.js` — reads the JSON and renders the dashboard.
- `styles.css` — all styling (dark theme, responsive).

## Updating the Tracker

Tell Kiro what changed in chat, and it will update `launch-data.json` for you. Or edit the JSON directly.

## Viewing Locally

Open `index.html` in a browser. Due to fetch() requiring a server for JSON loading, use one of these:

```bash
# Python (if installed)
python -m http.server 8080

# Node.js
npx serve .
```

Then visit `http://localhost:8080`.

## Deploying

For internal-only access at Amazon, deploy to S3 with CloudFront (corp-network restricted). Or host on any internal static file server.

## Data Format

See `launch-data.json` for the full schema. Key fields:

- `overallStatus`: "on-track", "at-risk", or "blocked"
- `milestones[].status`: "complete", "in-progress", or "not-started"
- `sites[].status`: "ready", "pending", or "blocked"
- `blockers`: array of strings (empty = no blockers)
