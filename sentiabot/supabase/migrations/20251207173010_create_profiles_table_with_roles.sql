-- This migration was created by the Supabase CLI.
-- It creates a 'profiles' table in the public schema to store user roles and other metadata.

BEGIN;

-- Create the profiles table
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    role TEXT DEFAULT 'student' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up Row Level Security (RLS) for the profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy to allow all authenticated users to view profiles (for example, to see other users' names/roles if needed)
CREATE POLICY "Public profiles are viewable by all users." ON public.profiles FOR SELECT USING (true);

-- Policy to allow a user to manage their own profile
CREATE POLICY "Users can update their own profile." ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Policy to allow inserts for authenticated users (handled by trigger later)
-- We will use a trigger to insert, so direct INSERT policy might not be needed for users.
-- For admin, they can insert directly if needed.

-- Create a trigger function to insert new users into profiles table
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'student');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger on auth.users for new sign-ups
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Optionally, insert/update an admin user.
-- REMEMBER TO REPLACE 'your_admin_email@example.com' WITH THE ACTUAL EMAIL!
-- You will need to manually run this part or ensure the email exists before running.
-- For a brand new user, the trigger will set their role to 'student'.
-- If you need to set an existing user as admin:
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'erstr9417@himolde.no';

COMMIT;

-- BEGIN;
--
-- -- Revert: Drop the trigger
-- DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
--
-- -- Revert: Drop the trigger function
-- DROP FUNCTION IF EXISTS public.handle_new_user();
--
-- -- Revert: Drop RLS policies (implicitly dropped when table is dropped, but good practice to explicitly drop policies first)
-- DROP POLICY IF EXISTS "Public profiles are viewable by all users." ON public.profiles;
-- DROP POLICY IF EXISTS "Users can update their own profile." ON public.profiles;
--
-- -- Revert: Drop the profiles table
-- DROP TABLE IF EXISTS public.profiles;
--
-- COMMIT;