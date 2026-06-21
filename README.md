# Community Compass

Community Compass is a TSA Webmaster 2026 community website for Middletown, Delaware. It helps students, families, adults, and seniors find local resources, events, volunteering opportunities, funding, student support, clubs, and TSA project information.

## Tech Stack

- React
- Vite
- JavaScript
- CSS

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

Run `npm run dev` in one terminal and `npm run api` in another when testing secure auth, community API endpoints, and event registration email.

## Folder Structure

- `src/App.jsx` manages page state, filters, saved resources, event registrations, volunteer applications, toast notifications, and active page rendering.
- `src/components/layout` contains the navbar, footer, and toast.
- `src/components/ui` contains small reusable UI pieces such as tags, section titles, and stat counters.
- `src/components/resources` contains resource-specific cards and filters.
- `src/components/ai` contains the local Resource Guide chat UI.
- `src/data` contains colors, navigation, resources, events, clubs, funding, stats, volunteer roles, and tag colors.
- `src/pages` contains the individual page sections while preserving the original internal state page switching.
- `src/styles/global.css` contains global CSS, font imports, animation keyframes, hover classes, and base form/link rules.
- `src/utils/localGuideResponses.js` contains safe local demo responses for the Resource Guide.
- `server` contains the Express API scaffold for secure auth, community posts, media upload handling, comments, likes, and event registration email.
- `docs/RESOURCE_DATABASE.md` contains a readable snapshot of the current resource database and recommended national expansion targets.

## Resource Guide Note

The Resource Guide currently uses safe local demo responses instead of a live external API. It does not expose API keys and does not call any external service from the browser.

## Auth, Community, and Email Notes

- The login/signup and community pages work immediately with local demo storage if the API is not running.
- When `npm run api` is running, auth requests use the Express backend with hashed passwords, HTTP-only cookies, validation, rate limiting, and secure headers.
- Event registration sends through the backend email endpoint. Configure SMTP values in `.env` for real email delivery; without SMTP, the backend creates a safe preview response for testing.

## Data Review Note

Resource, event, funding, and contact data should be verified before real-world public use.
