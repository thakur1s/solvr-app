-- Create projects table
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'planning' CHECK (status IN ('planning', 'in_progress', 'completed', 'on_hold')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  budget DECIMAL(10,2),
  start_date DATE,
  due_date DATE,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Create tasks table
CREATE TABLE public.tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'completed')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  assigned_to UUID REFERENCES auth.users(id),
  due_date TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Create project_members table for team collaboration
CREATE TABLE public.project_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member', 'viewer')),
  invited_by UUID REFERENCES auth.users(id),
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(project_id, user_id)
);

-- Enable RLS
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;

-- Create file_attachments table
CREATE TABLE public.file_attachments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  filename TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
  uploaded_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CHECK ((project_id IS NOT NULL AND task_id IS NULL) OR (project_id IS NULL AND task_id IS NOT NULL))
);

-- Enable RLS
ALTER TABLE public.file_attachments ENABLE ROW LEVEL SECURITY;

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('project_invite', 'task_assigned', 'task_completed', 'project_update', 'file_uploaded')),
  read BOOLEAN NOT NULL DEFAULT false,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create storage bucket for file attachments
INSERT INTO storage.buckets (id, name, public) VALUES ('project-files', 'project-files', false);

-- RLS Policies for projects
CREATE POLICY "Users can view projects they own or are members of"
ON public.projects FOR SELECT
USING (
  owner_id = auth.uid() OR 
  id IN (SELECT project_id FROM public.project_members WHERE user_id = auth.uid())
);

CREATE POLICY "Users can create their own projects"
ON public.projects FOR INSERT
WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Project owners and admins can update projects"
ON public.projects FOR UPDATE
USING (
  owner_id = auth.uid() OR
  id IN (SELECT project_id FROM public.project_members WHERE user_id = auth.uid() AND role IN ('admin'))
);

CREATE POLICY "Project owners can delete projects"
ON public.projects FOR DELETE
USING (owner_id = auth.uid());

-- RLS Policies for tasks
CREATE POLICY "Users can view tasks in their projects"
ON public.tasks FOR SELECT
USING (
  project_id IN (
    SELECT id FROM public.projects WHERE 
    owner_id = auth.uid() OR 
    id IN (SELECT project_id FROM public.project_members WHERE user_id = auth.uid())
  )
);

CREATE POLICY "Project members can create tasks"
ON public.tasks FOR INSERT
WITH CHECK (
  project_id IN (
    SELECT id FROM public.projects WHERE 
    owner_id = auth.uid() OR 
    id IN (SELECT project_id FROM public.project_members WHERE user_id = auth.uid() AND role IN ('owner', 'admin', 'member'))
  )
);

CREATE POLICY "Project members can update tasks"
ON public.tasks FOR UPDATE
USING (
  project_id IN (
    SELECT id FROM public.projects WHERE 
    owner_id = auth.uid() OR 
    id IN (SELECT project_id FROM public.project_members WHERE user_id = auth.uid() AND role IN ('owner', 'admin', 'member'))
  )
);

CREATE POLICY "Project owners and admins can delete tasks"
ON public.tasks FOR DELETE
USING (
  project_id IN (
    SELECT id FROM public.projects WHERE 
    owner_id = auth.uid() OR 
    id IN (SELECT project_id FROM public.project_members WHERE user_id = auth.uid() AND role IN ('owner', 'admin'))
  )
);

-- RLS Policies for project_members
CREATE POLICY "Users can view members of their projects"
ON public.project_members FOR SELECT
USING (
  project_id IN (
    SELECT id FROM public.projects WHERE 
    owner_id = auth.uid() OR 
    id IN (SELECT project_id FROM public.project_members WHERE user_id = auth.uid())
  )
);

CREATE POLICY "Project owners and admins can manage members"
ON public.project_members FOR ALL
USING (
  project_id IN (
    SELECT id FROM public.projects WHERE 
    owner_id = auth.uid() OR 
    id IN (SELECT project_id FROM public.project_members WHERE user_id = auth.uid() AND role IN ('admin'))
  )
);

-- RLS Policies for file_attachments
CREATE POLICY "Users can view files in their projects"
ON public.file_attachments FOR SELECT
USING (
  (project_id IS NOT NULL AND project_id IN (
    SELECT id FROM public.projects WHERE 
    owner_id = auth.uid() OR 
    id IN (SELECT project_id FROM public.project_members WHERE user_id = auth.uid())
  )) OR
  (task_id IS NOT NULL AND task_id IN (
    SELECT id FROM public.tasks WHERE project_id IN (
      SELECT id FROM public.projects WHERE 
      owner_id = auth.uid() OR 
      id IN (SELECT project_id FROM public.project_members WHERE user_id = auth.uid())
    )
  ))
);

CREATE POLICY "Project members can upload files"
ON public.file_attachments FOR INSERT
WITH CHECK (uploaded_by = auth.uid());

CREATE POLICY "File uploaders can delete their files"
ON public.file_attachments FOR DELETE
USING (uploaded_by = auth.uid());

-- RLS Policies for notifications
CREATE POLICY "Users can view their own notifications"
ON public.notifications FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "System can create notifications"
ON public.notifications FOR INSERT
WITH CHECK (true);

CREATE POLICY "Users can update their own notifications"
ON public.notifications FOR UPDATE
USING (user_id = auth.uid());

-- Storage policies for project files
CREATE POLICY "Users can view files in their projects"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'project-files' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can upload files to their projects"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'project-files' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their uploaded files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'project-files' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Add triggers for updated_at
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON public.tasks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for real-time updates
ALTER TABLE public.projects REPLICA IDENTITY FULL;
ALTER TABLE public.tasks REPLICA IDENTITY FULL;
ALTER TABLE public.project_members REPLICA IDENTITY FULL;
ALTER TABLE public.notifications REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER publication supabase_realtime ADD TABLE public.projects;
ALTER publication supabase_realtime ADD TABLE public.tasks;
ALTER publication supabase_realtime ADD TABLE public.project_members;
ALTER publication supabase_realtime ADD TABLE public.notifications;