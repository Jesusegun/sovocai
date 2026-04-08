🚀 FINAL SYSTEM DESIGN (MVP)
0. Core Principles (why this will work)
•	Deterministic, not “AI magic” 
•	One source of truth for users (via Supabase Auth) 
•	Minimal schema, no unnecessary tables 
•	Server-side data access only 
•	Fast to build, hard to break during demo 
________________________________________
1. DATABASE SCHEMA (FINAL)
✅ Use Supabase Auth + Profiles (correct pattern)
-- Profiles (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('admin','instructor','user')),
  created_at TIMESTAMP DEFAULT now()
);

-- Videos (core engine)
CREATE TABLE videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  youtube_url TEXT NOT NULL,
  skill_category TEXT NOT NULL,
  difficulty_level INTEGER NOT NULL CHECK (difficulty_level IN (1,2,3)),
  tags TEXT[] DEFAULT '{}',
  recommended_order INTEGER DEFAULT 0,
  instructor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT now()
);
________________________________________
💡 Why this exact design
•	profiles fixes the auth problem cleanly 
•	difficulty_level (1–3) = guaranteed ordering 
•	tags = future flexibility (no joins needed) 
•	recommended_order = manual fine-tuning lever 
•	No extra tables = speed 
________________________________________
2. AUTH & ACCESS (MVP SAFE VERSION)
Approach:
•	Use Supabase Auth (email/password) 
•	On signup → insert into profiles 
•	Role is selected via dropdown (for demo) 
Important constraint:
•	All DB writes happen server-side only 
[Inference] This avoids needing complex RLS during the MVP while keeping behavior predictable.
________________________________________
3. API DESIGN (FINAL)
Use Next.js Route Handlers (clear + easy to debug in a sprint).
Routes:
POST   /api/videos              → instructor uploads video
GET    /api/videos              → list videos (filtered)
GET    /api/learning-path       → generate path (CORE FEATURE)
GET    /api/admin/overview      → simple stats
________________________________________
💡 Why this
•	Minimal surface area 
•	Easy to test with Postman / browser 
•	Clean separation of concerns 
________________________________________
4. LEARNING PATH ALGORITHM (FINAL)
This is where we balance:
•	reliability (must not break) 
•	“AI feel” (must impress) 
________________________________________
Step 1: Fetch ordered videos
const { data: videos } = await supabase
  .from('videos')
  .select('*')
  .eq('skill_category', skill)
  .order('difficulty_level', { ascending: true })
  .order('recommended_order', { ascending: true });
________________________________________
Step 2: Smart but safe grouping
const stages = {
  "1. Foundations": [],
  "2. Core Skills": [],
  "3. Practical Application": []
};

videos.forEach(video => {
  if (video.difficulty_level === 1) {
    // PRIORITY RULE (tiny intelligence boost)
    if (video.tags.includes('safety') || video.tags.includes('intro')) {
      stages["1. Foundations"].unshift(video); // force to front
    } else {
      stages["1. Foundations"].push(video);
    }
  }

  if (video.difficulty_level === 2) {
    stages["2. Core Skills"].push(video);
  }

  if (video.difficulty_level === 3) {
    stages["3. Practical Application"].push(video);
  }
});
________________________________________
💡 Why this works
•	Cannot produce broken ordering 
•	Handles edge cases safely 
•	Adds just enough intelligence: 
o	safety/intro always first 
•	Still fully deterministic 
________________________________________
5. UI PAGES (FINAL)
Built with Next.js App Router.
________________________________________
Pages:
/
•	Skill selection (Plumbing, Solar, Electrical, etc.) 
________________________________________
/learn/[skill] ⭐ (MAIN DEMO PAGE)
•	“AI-Generated Learning Path” header 
•	Stage sections: 
o	Foundations 
o	Core Skills 
o	Practical Application 
•	Video cards: 
o	embedded YouTube player 
o	“Start Here” badge on first video 
o	“Next” button 
________________________________________
/instructor
•	Upload form: 
o	title 
o	YouTube URL 
o	skill 
o	difficulty (1–3) 
o	tags 
o	recommended_order 
________________________________________
/admin
•	Total users 
•	Total videos 
•	Simple list 
________________________________________
6. UX DETAILS (WHAT MAKES IT IMPRESSIVE)
These matter more than extra features:
•	“AI-Generated Learning Path” badge 
•	Clear stage numbering (1, 2, 3) 
•	First video labeled “Start Here” 
•	Clean card layout 
•	Fast loading (no spinners hanging) 
________________________________________
7. WHAT WE ARE NOT BUILDING (INTENTIONALLY)
To protect the 3-day timeline:
•	❌ No LLM integration 
•	❌ No file uploads (YouTube links only) 
•	❌ No complex permissions system 
•	❌ No caching layer (optional later) 
•	❌ No separate skills table 
•	❌ No progress tracking (unless extra time) 
________________________________________
8. DEMO STORY (WHAT YOU TELL THE DIRECTOR)
“We use structured metadata, difficulty progression, and tagging to generate a personalized learning path instantly. This allows us to deliver consistent, explainable recommendations without relying on expensive AI calls. In future versions, we can layer in AI for deeper personalization.”
________________________________________
🧠 Final Reality Check
This design is:
•	Fast to build ✅ 
•	Hard to break during demo ✅ 
•	Clear to explain ✅ 
•	Extendable later ✅ 
And most importantly:
•	It avoids the auth mistake 
•	It avoids overengineering 
•	It still feels like “AI”


You are a senior full-stack engineer. Build a complete, working MVP web application based strictly on the specifications below.
•	
•	Do NOT introduce alternative architectures.
•	Do NOT overengineer.
•	Do NOT add extra features not listed.
•	
•	This is a 3-day demo product. Optimize for speed, clarity, reliability, and beautiful UI.
•	
•	==================================================
•	PRODUCT OVERVIEW
•	==================================================
•	
•	We are building a web-based learning platform.
•	
•	Core idea:
•	- Instructors upload YouTube videos with metadata
•	- Users select a skill such as Plumbing
•	- The system generates a structured, AI-like learning path from those videos
•	
•	There is NO LLM or real AI.
•	The intelligence comes from metadata, ordering, and deterministic rules.
•	
•	==================================================
•	TECH STACK
•	==================================================
•	
•	- Framework: Next.js, App Router
•	- Language: TypeScript
•	- Styling: Tailwind CSS
•	- Backend, Auth, DB: Supabase
•	- Deployment: Vercel
•	
•	Use a clean, modern component approach.
•	Prefer shadcn/ui style components if helpful.
•	
•	==================================================
•	AUTHENTICATION AND USER MODEL
•	==================================================
•	
•	Use Supabase Auth with email and password.
•	
•	Signup flow:
•	- User signs up with email and password
•	- User selects role during signup:
•	  - user
•	  - instructor
•	- Admin is NOT selectable and is not user-facing
•	
•	Profiles table:
•	Create a profiles table linked to auth.users.
•	
•	Schema:
•	- id, uuid, primary key, references auth.users.id
•	- full_name, text
•	- role, text, values: admin, instructor, user, default user
•	- created_at, timestamp
•	
•	Profile creation requirement:
•	- Create the profile row reliably when the auth user is created
•	- If email confirmation is enabled, use a Postgres trigger or an equivalent server-side approach
•	- Do not let signup fail silently if the profile row is not ready
•	- Handle signup/profile creation errors gracefully
•	
•	Admin account:
•	- The first admin is created manually or by seed logic, not through public signup
•	- The app must include a clear way to create or seed the first admin user for the demo
•	
•	==================================================
•	DATABASE SCHEMA
•	==================================================
•	
•	Use Supabase Postgres.
•	
•	profiles
•	- id, uuid, primary key, references auth.users.id
•	- full_name, text
•	- role, text, admin | instructor | user
•	- created_at, timestamp
•	
•	videos
•	- id, uuid, primary key, generated automatically
•	- title, text, required
•	- youtube_url, text, required
•	- skill_category, text, required, for example plumbing
•	- difficulty_level, integer, values 1, 2, 3
•	- tags, text array
•	- recommended_order, integer, default 0
•	- instructor_id, uuid, references profiles.id
•	- created_at, timestamp
•	
•	Do NOT create additional tables for the MVP.
•	
•	==================================================
•	SEED DATA
•	==================================================
•	
•	Add sample seed data so the Director can immediately test the app.
•	
•	Seed at least:
•	- 3 sample skills, such as Plumbing, Solar Installation, Electrical Wiring
•	- 3 to 5 sample videos per skill
•	- A mix of difficulty levels
•	- Tags such as safety, intro, tools, basics, installation, maintenance
•	
•	The app should not feel empty on first run.
•	There must be real sample content visible immediately after setup.
•	
•	==================================================
•	BACKEND DESIGN
•	==================================================
•	
•	Use Next.js Route Handlers, not a separate backend framework.
•	
•	All database operations must happen server-side using Supabase server client utilities.
•	Do NOT call Supabase directly from client components.
•	
•	Required routes:
•	
•	1. POST /api/videos
•	Purpose:
•	- Instructor uploads a video
•	
•	Access:
•	- Only role = instructor
•	
•	Input:
•	- title
•	- youtube_url
•	- skill_category
•	- difficulty_level
•	- tags
•	- recommended_order
•	
•	Behavior:
•	- Validate role
•	- Insert into videos table
•	- Attach instructor_id
•	
•	2. GET /api/videos
•	Purpose:
•	- Fetch videos
•	
•	Optional query:
•	- ?skill=plumbing
•	
•	Return:
•	- Full list or filtered list
•	
•	3. GET /api/learning-path?skill=plumbing
•	Purpose:
•	- Core feature
•	- Generate structured learning path
•	
•	4. GET /api/admin/overview
•	Purpose:
•	- Basic stats for admin dashboard
•	- total users
•	- total videos
•	
•	Access:
•	- Only role = admin
•	
•	==================================================
•	ROLE ENFORCEMENT
•	==================================================
•	
•	Do NOT rely on RLS for the MVP.
•	
•	Instead:
•	- Fetch current user via Supabase server client
•	- Query the profiles table
•	- Enforce role checks inside each route handler
•	
•	Examples:
•	- POST /api/videos, only instructor
•	- GET /api/admin/overview, only admin
•	
•	If a user is unauthorized, return a clean 403 response.
•	
•	==================================================
•	LEARNING PATH ALGORITHM
•	==================================================
•	
•	This is the deterministic AI replacement.
•	
•	Steps:
•	
•	1. Fetch videos where skill_category matches the selected skill
•	2. Sort by:
•	- difficulty_level ASC
•	- recommended_order ASC
•	
•	3. Group into stages:
•	- Level 1, Foundations
•	- Level 2, Core Skills
•	- Level 3, Practical Application
•	
•	4. Priority rule inside Foundations:
•	- Videos with tag safety or intro must appear first inside the Foundations stage
•	- Use a priority sort, not duplication
•	- Sort by has_safety_tag DESC first, then recommended_order ASC
•	
•	5. Output format:
•	{
•	  stages: [
•	    {
•	      stage: "1. Foundations",
•	      videos: [...]
•	    },
•	    {
•	      stage: "2. Core Skills",
•	      videos: [...]
•	    },
•	    {
•	      stage: "3. Practical Application",
•	      videos: [...]
•	    }
•	  ],
•	  totalVideos: number
•	}
•	
•	The result must be deterministic and stable.
•	No randomness.
•	No LLM calls.
•	
•	==================================================
•	FRONTEND PAGES
•	==================================================
•	
•	Use Next.js App Router.
•	
•	Required pages:
•	
•	1. /
•	Landing page
•	
•	Must show hardcoded skill options:
•	- Plumbing
•	- Solar Installation
•	- Electrical Wiring
•	
•	Each card links to:
•	- /learn/[skill]
•	
•	2. /learn/[skill]
•	This is the main page.
•	
•	It must look polished, modern, and demo-ready.
•	Not generic.
•	Not plain.
•	Not boring.
•	
•	Layout:
•	- Header: AI-Generated Learning Path
•	- Short explanatory subtext
•	- Stage sections:
•	  - 1. Foundations
•	  - 2. Core Skills
•	  - 3. Practical Application
•	
•	Each video card should include:
•	- Embedded YouTube iframe, not external link only
•	- Title
•	- Tags displayed as stylish badges
•	- Instructor name if available
•	- Start Here badge on the first video of the first stage
•	
•	Optional:
•	- A Next button for visual polish
•	- Smooth scroll or focus behavior when moving through videos
•	
•	3. /instructor
•	Instructor dashboard
•	
•	Features:
•	- Upload form
•	- Fields:
•	  - title
•	  - youtube_url
•	  - skill_category, dropdown
•	  - difficulty_level, select 1 to 3
•	  - tags, comma-separated input converted to array
•	  - recommended_order
•	- Optional list of uploaded videos
•	
•	4. /admin
•	Admin dashboard
•	
•	Features:
•	- total users
•	- total videos
•	- simple content overview
•	- clear monitoring UI
•	
•	==================================================
•	UI AND VISUAL DESIGN
•	==================================================
•	
•	The UI must feel premium for a demo.
•	
•	Requirements:
•	- Clean modern layout
•	- Strong spacing and typography
•	- Card-based design
•	- Rounded corners
•	- Subtle shadows
•	- Responsive mobile-first behavior
•	- Dark or neutral theme preferred
•	- Beautiful, not generic
•	
•	Important visual details:
•	- AI-Generated Learning Path badge
•	- Start Here highlight
•	- Clean stage separation
•	- Nice button states
•	- Smooth loading state
•	- Good empty states
•	- Sample data should make the UI feel alive immediately
•	
•	==================================================
•	DO NOT ADD
•	==================================================
•	
•	- No LLM integration
•	- No file uploads
•	- No progress tracking
•	- No extra tables
•	- No complex permission system
•	- No heavy caching layer unless absolutely necessary
•	- No unnecessary abstractions
•	
•	==================================================
•	DEMO GOAL
•	==================================================
•	
•	The MVP must let a viewer do this:
•	1. Open the app
•	2. Pick a skill
•	3. See a structured learning path
•	4. Watch embedded videos
•	5. Experience a polished, believable product
•	
•	The app must run locally and be deployable to Vercel.

•	Build the full codebase accordingly.

