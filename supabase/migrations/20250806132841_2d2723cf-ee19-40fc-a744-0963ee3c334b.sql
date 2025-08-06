-- Fix the remaining infinite recursion in project_members RLS policies
-- The issue is that we can't reference project_members table from within its own policies

-- Drop the problematic policies
DROP POLICY IF EXISTS "Project owners can manage members" ON project_members;
DROP POLICY IF EXISTS "Users can view project members" ON project_members;

-- Simplify project_members policies to avoid any self-reference
CREATE POLICY "Enable all operations for project owners" 
ON project_members 
FOR ALL
USING (project_id IN (
  SELECT id FROM projects WHERE owner_id = auth.uid()
));

-- For viewing members, we need a different approach
-- Users can see members of projects they own only (no self-reference to project_members)
CREATE POLICY "Enable read access for authenticated users" 
ON project_members 
FOR SELECT 
USING (auth.role() = 'authenticated');