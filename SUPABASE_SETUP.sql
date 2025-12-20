-- =====================================================
-- SUPABASE AUTHENTICATION SETUP SCRIPTS
-- Run these in your Supabase SQL Editor
-- =====================================================

-- =====================================================
-- 1. CREATE USER PROFILES TABLE
-- =====================================================
-- This table stores additional user information
-- linked to Supabase Auth users

CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add helpful comments
COMMENT ON TABLE user_profiles IS 'Stores additional user profile information linked to Supabase auth users';
COMMENT ON COLUMN user_profiles.user_id IS 'Foreign key to auth.users table';
COMMENT ON COLUMN user_profiles.email IS 'User email address';

-- =====================================================
-- 2. ENABLE ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 3. CREATE RLS POLICIES FOR USER PROFILES
-- =====================================================

-- Policy: Users can view their own profile
CREATE POLICY "Users can view their own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update their own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can insert their own profile
CREATE POLICY "Users can insert their own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own profile
CREATE POLICY "Users can delete their own profile"
  ON user_profiles FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- 4. CREATE INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_user_profiles_email ON user_profiles(email);

-- =====================================================
-- 5. UPDATE SENSOR DATA TABLE RLS (If not already set up)
-- =====================================================

-- Make sure sensor data table has proper RLS policies
-- Uncomment and modify if needed

-- ALTER TABLE new_sensor_data ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to read sensor data
-- CREATE POLICY "Authenticated users can read sensor data"
--   ON new_sensor_data FOR SELECT
--   USING (auth.role() = 'authenticated');

-- Allow sensor device to insert data
-- CREATE POLICY "Service role can insert sensor data"
--   ON new_sensor_data FOR INSERT
--   WITH CHECK (true);

-- =====================================================
-- 6. CREATE AUDIT LOG TABLE (OPTIONAL)
-- =====================================================

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  table_name TEXT,
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  ip_address INET
);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- =====================================================
-- 7. CREATE FUNCTION TO AUTO-CREATE USER PROFILE
-- =====================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$;

-- =====================================================
-- 8. CREATE TRIGGER FOR AUTO USER PROFILE CREATION
-- =====================================================

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- =====================================================
-- 9. VERIFY SETUP
-- =====================================================

-- Check if tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('user_profiles', 'new_sensor_data', 'audit_logs');

-- Check RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('user_profiles', 'new_sensor_data');

-- =====================================================
-- NOTES FOR SETUP
-- =====================================================
/*

1. EMAIL VERIFICATION (Optional but recommended):
   - Go to Supabase Dashboard → Authentication → Policies
   - Enable "Confirm email" to require email verification

2. STRONG PASSWORD REQUIREMENTS (Optional):
   - Set minimum password length to 6+ characters
   - Require special characters if desired

3. SESSION DURATION:
   - Configure session timeout in Auth → Policies
   - Default is 24 hours

4. TESTING:
   - Create a test user: demo@example.com / demo123456
   - Verify user_profiles table has the entry
   - Test login/logout in application

5. DEMO USER:
   - You can manually insert or use sign-up
   - Recommended: Use application sign-up

6. MONITORING:
   - Check Supabase logs for auth failures
   - Monitor audit_logs table for activity
   - Review RLS policy violations in logs

7. BACKUP:
   - Regular backups of user data
   - Export auth logs periodically
   - Keep backup of password reset tokens

8. SECURITY CHECKLIST:
   ✓ RLS policies enabled on all tables
   ✓ Sensitive data protected with policies
   ✓ Service role used only for backend operations
   ✓ Auth tokens stored securely
   ✓ HTTPS enforced for all connections
   ✓ Regular security audits

*/

-- =====================================================
-- CLEANUP (If needed, use with caution)
-- =====================================================

-- Drop everything (WARNING: This deletes all data!)
/*
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS user_profiles;
*/
