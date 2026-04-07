# Sovocai MVP

Deterministic AI-like learning paths for skilled trades. Instructors upload YouTube videos with metadata, and users get a stable, stage-based learning path.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- Supabase (Auth + Postgres)

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. In Supabase SQL editor, run:

- `supabase/schema.sql`
- `supabase/seed.sql`

4. Start dev server:

```bash
npm run dev
```

5. Open:

`http://localhost:3000`

## Demo Accounts (How To Set First Admin)

Admin is not selectable from public signup. For the first admin:

1. Sign up a normal account in the app, for example `admin@sovocai.demo`.
2. Run this SQL in Supabase:

```sql
UPDATE public.profiles
SET role = 'admin'
WHERE id = (
	SELECT id FROM auth.users WHERE email = 'admin@sovocai.demo'
);
```

Optional instructor promotion:

```sql
UPDATE public.profiles
SET role = 'instructor'
WHERE id = (
	SELECT id FROM auth.users WHERE email = 'instructor@sovocai.demo'
);
```

## Required Routes

- `POST /api/videos` (instructor only)
- `GET /api/videos?skill=...`
- `GET /api/learning-path?skill=...`
- `GET /api/admin/overview` (admin only)

## Learning Path Logic

For selected skill:

1. Sort by `difficulty_level ASC`, then `recommended_order ASC`
2. Group into stages:
- `1. Foundations`
- `2. Core Skills`
- `3. Practical Application`
3. Inside Foundations, prioritize videos tagged `safety` or `intro`, then sort by `recommended_order ASC`

No randomness and no LLM calls.
