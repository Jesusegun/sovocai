-- ============================================================
-- RLS Policies
-- ============================================================

-- Videos: public read access
CREATE POLICY "Enable read access for all users" ON "public"."videos"
  AS PERMISSIVE FOR SELECT TO public USING (true);

-- Profiles: public read access (for instructor names, etc.)
CREATE POLICY "Enable read access for all users" ON "public"."profiles"
  AS PERMISSIVE FOR SELECT TO public USING (true);

-- Videos: authenticated instructors can insert their own
CREATE POLICY "Allow authenticated users to insert own videos" ON "public"."videos"
  AS PERMISSIVE FOR INSERT TO authenticated
  WITH CHECK (instructor_id = auth.uid());

-- User Progress: users can read their own progress
CREATE POLICY "Users can read own progress" ON "public"."user_progress"
  AS PERMISSIVE FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- User Progress: users can insert their own progress
CREATE POLICY "Users can insert own progress" ON "public"."user_progress"
  AS PERMISSIVE FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- User Progress: users can update their own progress
CREATE POLICY "Users can update own progress" ON "public"."user_progress"
  AS PERMISSIVE FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ============================================================
-- Seed Data: Videos
-- ============================================================

-- Demo setup for admin (run AFTER creating a real auth user with this email):
-- UPDATE public.profiles
-- SET role = 'admin'
-- WHERE id = (
--   SELECT id FROM auth.users WHERE email = 'admin@sovocai.demo'
-- );

INSERT INTO videos (title, youtube_url, skill_category, difficulty_level, tags, recommended_order) VALUES
-- Plumbing
('Basic Plumbing Tools for Beginners', 'https://www.youtube.com/embed/YpX5K9Xvwv8', 'Plumbing', 1, '{"intro", "tools"}', 1),
('Plumbing Safety Requirements', 'https://www.youtube.com/embed/5F_uJ2K-BwA', 'Plumbing', 1, '{"safety", "basics"}', 2),
('How to Fix a Leaky Faucet', 'https://www.youtube.com/embed/1vR_sBszsOQ', 'Plumbing', 2, '{"maintenance", "hands-on"}', 1),
('Installing a New Sink Drain', 'https://www.youtube.com/embed/P6Azzv3rS24', 'Plumbing', 2, '{"installation", "core"}', 2),
('Advanced Pipe Soldering', 'https://www.youtube.com/embed/2vB_Q1Q4qgI', 'Plumbing', 3, '{"advanced", "soldering"}', 1),

-- Solar Installation
('Solar Energy Basics', 'https://www.youtube.com/embed/xKxrkht7CpY', 'Solar Installation', 1, '{"intro", "theory"}', 1),
('Roof Safety for Solar Techs', 'https://www.youtube.com/embed/NnL7zDntQoA', 'Solar Installation', 1, '{"safety", "roofing"}', 2),
('Mounting Solar Panels', 'https://www.youtube.com/embed/Y-P9zB2kZbk', 'Solar Installation', 2, '{"installation", "mounts"}', 1),
('Wiring the Inverter', 'https://www.youtube.com/embed/WJ6Y1qU9x5w', 'Solar Installation', 2, '{"electrical", "wiring"}', 2),
('Off-Grid Battery Setup', 'https://www.youtube.com/embed/1vR_sBszsOQ', 'Solar Installation', 3, '{"advanced", "batteries"}', 1),

-- Electrical Wiring
('Electrical Hazards and Safety', 'https://www.youtube.com/embed/D3sR6RjVv_M', 'Electrical Wiring', 1, '{"safety", "hazards"}', 1),
('Understanding Voltage and Current', 'https://www.youtube.com/embed/mc979OhitAg', 'Electrical Wiring', 1, '{"intro", "theory"}', 2),
('Wiring an Outlet', 'https://www.youtube.com/embed/bxWwM9Fw9wE', 'Electrical Wiring', 2, '{"core", "hands-on"}', 1),
('Installing a Ceiling Fan', 'https://www.youtube.com/embed/Ubwq45w_tSg', 'Electrical Wiring', 2, '{"installation"}', 2),
('Upgrading a Subpanel', 'https://www.youtube.com/embed/1vR_sBszsOQ', 'Electrical Wiring', 3, '{"advanced", "panel"}', 1),

-- Construction
('Construction Site Safety', 'https://www.youtube.com/embed/D3sR6RjVv_M', 'Construction', 1, '{"safety", "basics"}', 1),
('Reading Blueprints 101', 'https://www.youtube.com/embed/mc979OhitAg', 'Construction', 1, '{"intro", "theory"}', 2),
('Foundation and Concrete Work', 'https://www.youtube.com/embed/bxWwM9Fw9wE', 'Construction', 2, '{"core", "hands-on"}', 1),
('Wall Framing Techniques', 'https://www.youtube.com/embed/Ubwq45w_tSg', 'Construction', 2, '{"installation", "framing"}', 2),
('Roofing and Finishing', 'https://www.youtube.com/embed/2vB_Q1Q4qgI', 'Construction', 3, '{"advanced", "roofing"}', 1),

-- Automotive Repair
('Auto Repair Safety Essentials', 'https://www.youtube.com/embed/5F_uJ2K-BwA', 'Automotive Repair', 1, '{"safety", "basics"}', 1),
('Understanding Your Engine', 'https://www.youtube.com/embed/xKxrkht7CpY', 'Automotive Repair', 1, '{"intro", "theory"}', 2),
('Brake Pad Replacement', 'https://www.youtube.com/embed/Y-P9zB2kZbk', 'Automotive Repair', 2, '{"maintenance", "hands-on"}', 1),
('Oil Change and Fluid Top-Off', 'https://www.youtube.com/embed/WJ6Y1qU9x5w', 'Automotive Repair', 2, '{"maintenance", "core"}', 2),
('Diagnosing Engine Problems', 'https://www.youtube.com/embed/NnL7zDntQoA', 'Automotive Repair', 3, '{"advanced", "diagnostics"}', 1),

-- Tailoring
('Sewing Machine Safety and Setup', 'https://www.youtube.com/embed/P6Azzv3rS24', 'Tailoring', 1, '{"safety", "intro"}', 1),
('Fabric Types and Selection', 'https://www.youtube.com/embed/YpX5K9Xvwv8', 'Tailoring', 1, '{"intro", "theory"}', 2),
('Basic Stitching Techniques', 'https://www.youtube.com/embed/1vR_sBszsOQ', 'Tailoring', 2, '{"core", "hands-on"}', 1),
('Pattern Cutting Fundamentals', 'https://www.youtube.com/embed/mc979OhitAg', 'Tailoring', 2, '{"core", "tools"}', 2),
('Garment Construction Project', 'https://www.youtube.com/embed/bxWwM9Fw9wE', 'Tailoring', 3, '{"advanced", "project"}', 1);
