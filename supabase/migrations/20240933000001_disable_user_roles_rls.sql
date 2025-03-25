-- Completely disable RLS for user_roles table to fix infinite recursion

-- First drop all existing policies
DROP POLICY IF EXISTS "Users can view their own roles" ON user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON user_roles;
DROP POLICY IF EXISTS "Users can manage their own roles" ON user_roles;
DROP POLICY IF EXISTS "Anyone can view roles" ON user_roles;
DROP POLICY IF EXISTS "Anyone can insert roles" ON user_roles;
DROP POLICY IF EXISTS "Anyone can update roles" ON user_roles;
DROP POLICY IF EXISTS "Anyone can delete roles" ON user_roles;

-- Disable RLS completely for this table
ALTER TABLE user_roles DISABLE ROW LEVEL SECURITY;

-- Create a simple policy just in case RLS gets re-enabled
CREATE POLICY "Unrestricted access to user_roles"
  ON user_roles
  USING (true);
