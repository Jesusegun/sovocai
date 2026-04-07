-- First, let's create a dump admin user profile manually if needed, but for the seed data, 
-- we will just insert an admin profile directly into auth.users and profiles if possible via SQL.
-- However, inserting into auth.users requires hashing passwords which is complex in pure SQL.
-- Instead, we will just insert seed videos and leave instructor_id null for now, 
-- or you can manually create an instructor user in the dashboard and assign their ID later.

-- Demo setup for first admin (run AFTER creating a real auth user with this email):
-- UPDATE public.profiles
-- SET role = 'admin'
-- WHERE id = (
--   SELECT id FROM auth.users WHERE email = 'admin@sovocai.demo'
-- );
--
-- Optional: promote a demo instructor user similarly:
-- UPDATE public.profiles
-- SET role = 'instructor'
-- WHERE id = (
--   SELECT id FROM auth.users WHERE email = 'instructor@sovocai.demo'
-- );

-- Optional: If you want to allow anonymous read access while RLS is enabled:
CREATE POLICY "Enable read access for all users" ON "public"."videos" AS PERMISSIVE FOR SELECT TO public USING (true);
CREATE POLICY "Enable read access for all users" ON "public"."profiles" AS PERMISSIVE FOR SELECT TO public USING (true);

-- Seed Data for Videos
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
('Upgrading a Subpanel', 'https://www.youtube.com/embed/1vR_sBszsOQ', 'Electrical Wiring', 3, '{"advanced", "panel"}', 1);
