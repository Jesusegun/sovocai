# Sovocai MVP

Deterministic learning paths for skilled trades.

## Quickstart

1. Install:

```bash
npm install
```

2. Set env in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. Run SQL in Supabase (in order):
- `supabase/schema.sql`
- `supabase/seed.sql`

4. Start app:

```bash
npm run dev
```

Open: `http://localhost:3000`

## Admin Setup (One-Time)

Sign up a normal user, then promote to admin:

```sql
UPDATE public.profiles
SET role = 'admin'
WHERE id = (
  SELECT id FROM auth.users WHERE email = 'admin@sovocai.demo'
);
```

## Deploy

Set the same two env vars in Vercel, redeploy, then test `/`, `/learn/Plumbing`, `/instructor`, and `/admin`.
