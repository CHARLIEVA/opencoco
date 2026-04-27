# OpenCoco

OpenCoco is a bilingual prompt case library for `GPT image2` and `Nano Banana`.

This first version includes:

- Chinese and English public site
- Xiaohongshu-style masonry feed
- Case detail pages with prompt, notes, and source link
- Admin password login for case management
- Google sign-in favorites via Supabase
- Feed-style ad card slots that can later be replaced with Google AdSense
- Local JSON seed mode for development
- Supabase-backed mode for production persistence

## Tech stack

- `Next.js 16`
- `React 19`
- `Tailwind CSS 4`
- `Supabase` for Google auth and favorites

## Local development

Install dependencies:

```bash
pnpm install
```

Start the dev server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Admin login

By default, local development uses:

- username: `admin`
- password: `opencoco123`

You should override these in `.env.local`.

## Environment variables

Copy the template:

```bash
cp .env.example .env.local
```

If you do not configure Supabase, the site still works in read-only mode with:

- public case browsing
- bilingual pages
- local JSON-backed admin create/edit/delete

Without Supabase, these features stay disabled:

- Google sign-in
- persistent favorites
- production-safe remote case storage

## Supabase setup

Create a Supabase project and run the SQL in [supabase/schema.sql](./supabase/schema.sql).

Then fill:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

In Supabase Auth:

1. Enable `Google` provider.
2. Add your local callback URL:
   - `http://localhost:3000/api/auth/callback`
3. Add your production callback URL:
   - `https://opencoco.xyz/api/auth/callback`

## Deployment

Recommended production path:

1. Push this repo to GitHub
2. Import it into Vercel
3. Add all environment variables from `.env.example`
4. Point your domain `opencoco.xyz` to Vercel
5. In Supabase Auth, add the production callback URL

## AdSense integration plan

The current homepage already supports native-looking ad cards in the feed.

When you are ready to add Google ads:

1. Apply for Google AdSense
2. Add the AdSense script in the site layout
3. Replace the demo ad card component with a real ad unit block
4. Keep the card shape and spacing so it blends into the content feed

I did not hardcode AdSense yet because you do not have an account configured, and it is better to add your real publisher ID later.

## Seed content

The project currently includes an initial set of cases inspired by public sources, including:

- `@youngcatwoman` on X
- `ChatGPT Design`
- `Max Woolf`
- `TechRadar`
- `Kol Tregaskes`

The current content is meant to validate site structure and workflow. You can keep expanding it through the admin panel or by importing more curated sources later.
