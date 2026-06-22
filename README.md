# Community Compass

Community Compass is a React/Vite civic resource platform for finding support, funding, volunteering, student programs, events, and community organizations. The database is now structured to scale nationally while keeping the existing Middletown, Delaware profile intact.

## Tech Stack

- React
- Vite
- JavaScript
- CSS
- Optional Express API for shared community/auth features

## Setup

```bash
npm install
npm run dev
npm run build
```

Optional secure API server:

```bash
copy .env.example .env
npm run api
```

Run `npm run dev:full` to start both the Vite frontend and Express API together. After `npm run build`, `npm run api` also serves the built website and API together at `http://localhost:8787`.

## Database Architecture

Community Compass uses static local JavaScript data with three clear coverage layers:

- `src/data/national` contains national resources, funding sources, volunteer platforms, category files, and filtered category exports.
- `src/data/states` contains all 50 states plus Washington, D.C. as state profiles with placeholder arrays for future verified state resources.
- `src/data/local` contains local profiles. The existing Middletown, Delaware data is preserved as `middletown-de`.

Location support lives in:

- `src/data/location/zipToState.js` for approximate ZIP-to-state lookup.
- `src/data/location/locationLookup.js` for combining national, state, and local results.
- `src/components/location/LocationSelector.jsx` for selecting ZIP, state, local profile, and national coverage.

## Data Status Labels

Every resource should identify how trustworthy or complete its data is:

- `verified` means the team has verified the resource details.
- `source-linked` means an official or locator source is linked, but details still need confirmation.
- `needs-review` means the item should be manually checked before public use.
- `sample` means the item is retained as demo/local sample data.
- `placeholder` means the state/local slot exists but should not be treated as complete coverage.

Users should confirm eligibility, hours, availability, and deadlines on official websites.

## Adding a State Profile

1. Add or confirm the state in `src/data/states/usStates.js`.
2. Add official state-level URLs only when they are known and verified.
3. Add verified resources to the matching profile arrays in `src/data/states/stateProfiles.js`.
4. Keep unknown state resources as placeholders instead of inventing organizations, addresses, phone numbers, or deadlines.

## Adding a Local Profile

1. Create a local profile file under `src/data/local`.
2. Export it from `src/data/local/index.js`.
3. Reference the local profile ID from the matching state profile.
4. Mark unverified local resources as `sample` or `needs-review`.
5. Include source URLs, locator URLs, verified dates, and verification notes whenever possible.

## Verifying a Resource

Before treating a resource as ready for real-world public use:

- Confirm the organization name and official website.
- Confirm phone numbers, addresses, hours, eligibility, languages, and service availability.
- Confirm grant amounts and deadlines through official application sources.
- Add `verifiedDate` when checked.
- Add `verificationNote` when details are partial, seasonal, or likely to change.

The project intentionally avoids fake local organizations, fake addresses, fake phone numbers, fake grant deadlines, and fake official verification.

## Key Files

- `src/pages/ResourcesPage.jsx` shows national/state/local combined resource results with coverage and verification badges.
- `src/pages/FundingPage.jsx` shows national funding, state placeholders, and local funding leads.
- `src/pages/VolunteeringPage.jsx` separates national volunteer platforms from local volunteer roles.
- `src/components/ai/AIChat.jsx` uses built-in static guidance and does not call a live AI API.
- `src/utils/localGuideResponses.js` generates safe category-based guide responses from the static data.
- `src/components/features/TrustPanel.jsx` explains the verification model.

## API Notes

- The login/signup and community pages work immediately with local browser storage if the API is not running.
- When `npm run api` is running, auth requests use the Express service with hashed passwords, secure session cookies, validation, rate limiting, and secure headers.
- Event registration can use the service email endpoint. Configure SMTP values in `.env` for real email delivery; without SMTP, the service creates a safe preview response for testing.

## Resource Guide Note

The Resource Guide uses safe built-in responses instead of a live external AI API. It does not expose API keys and does not call any external AI service from the browser.
