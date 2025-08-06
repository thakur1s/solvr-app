-- Fix the infinite recursion in project_members RLS policies
-- The issue is that the policies are referencing project_members table within itself

-- Drop existing policies for project_members
DROP POLICY IF EXISTS "Project owners and admins can manage members" ON project_members;
DROP POLICY IF EXISTS "Users can view members of their projects" ON project_members;

-- Create corrected policies without self-reference
CREATE POLICY "Project owners can manage members" 
ON project_members 
FOR ALL 
USING (project_id IN (
  SELECT id FROM projects WHERE owner_id = auth.uid()
));

CREATE POLICY "Users can view project members" 
ON project_members 
FOR SELECT 
USING (project_id IN (
  SELECT id FROM projects 
  WHERE owner_id = auth.uid() OR id IN (
    SELECT pm.project_id FROM project_members pm WHERE pm.user_id = auth.uid()
  )
));

-- Also fix projects policies to avoid potential recursion
DROP POLICY IF EXISTS "Project owners and admins can update projects" ON projects;
DROP POLICY IF EXISTS "Users can view projects they own or are members of" ON projects;

CREATE POLICY "Project owners can update projects" 
ON projects 
FOR UPDATE 
USING (owner_id = auth.uid());

CREATE POLICY "Users can view their projects" 
ON projects 
FOR SELECT 
USING (
  owner_id = auth.uid() 
  OR id IN (
    SELECT project_id FROM project_members WHERE user_id = auth.uid()
  )
);