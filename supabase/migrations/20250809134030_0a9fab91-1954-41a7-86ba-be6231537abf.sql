-- Fix infinite recursion in RLS policies by completely rewriting them
-- This is a comprehensive fix for all RLS policy issues

-- First, drop all existing problematic policies
DROP POLICY IF EXISTS "Users can view their projects" ON projects;
DROP POLICY IF EXISTS "Users can view tasks in their projects" ON tasks;
DROP POLICY IF EXISTS "Project members can create tasks" ON tasks;
DROP POLICY IF EXISTS "Project members can update tasks" ON tasks;
DROP POLICY IF EXISTS "Project owners and admins can delete tasks" ON tasks;

-- Create a security definer function to check project membership
CREATE OR REPLACE FUNCTION public.is_project_member(project_uuid uuid)
RETURNS boolean AS $$
BEGIN
  -- Check if user is project owner or member
  RETURN EXISTS (
    SELECT 1 FROM projects p 
    WHERE p.id = project_uuid AND p.owner_id = auth.uid()
  ) OR EXISTS (
    SELECT 1 FROM project_members pm 
    WHERE pm.project_id = project_uuid AND pm.user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a security definer function to check if user is project owner
CREATE OR REPLACE FUNCTION public.is_project_owner(project_uuid uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM projects p 
    WHERE p.id = project_uuid AND p.owner_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a security definer function to check if user is project owner or admin
CREATE OR REPLACE FUNCTION public.is_project_owner_or_admin(project_uuid uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM projects p 
    WHERE p.id = project_uuid AND p.owner_id = auth.uid()
  ) OR EXISTS (
    SELECT 1 FROM project_members pm 
    WHERE pm.project_id = project_uuid 
    AND pm.user_id = auth.uid() 
    AND pm.role IN ('owner', 'admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate projects policies using the security definer functions
CREATE POLICY "Users can view their projects" 
ON projects 
FOR SELECT 
USING (
  owner_id = auth.uid() OR 
  public.is_project_member(id)
);

-- Recreate tasks policies using the security definer functions
CREATE POLICY "Users can view tasks in their projects" 
ON tasks 
FOR SELECT 
USING (public.is_project_member(project_id));

CREATE POLICY "Project members can create tasks" 
ON tasks 
FOR INSERT 
WITH CHECK (public.is_project_member(project_id));

CREATE POLICY "Project members can update tasks" 
ON tasks 
FOR UPDATE 
USING (public.is_project_member(project_id));

CREATE POLICY "Project owners and admins can delete tasks" 
ON tasks 
FOR DELETE 
USING (public.is_project_owner_or_admin(project_id));