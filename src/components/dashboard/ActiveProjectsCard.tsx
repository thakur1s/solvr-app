import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { FolderKanban } from "lucide-react";
import { useProjects } from "@/hooks/useProjects";
import { useTasks } from "@/hooks/useTasks";
import { format } from "date-fns";

export function ActiveProjectsCard() {
  const { projects } = useProjects();
  const { tasks } = useTasks();

  // Get active projects (top 3)
  const activeProjects = projects
    .filter(p => p.status === 'in_progress' || p.status === 'planning')
    .slice(0, 3);

  const getProjectTasks = (projectId: string) => {
    const projectTasks = tasks.filter(t => t.project_id === projectId);
    const completedTasks = projectTasks.filter(t => t.status === 'completed');
    return { completed: completedTasks.length, total: projectTasks.length };
  };

  const getProjectStatus = (progress: number, dueDate?: string) => {
    if (!dueDate) {
      return { label: "On Track", className: "bg-success/10 text-success" };
    }
    
    const due = new Date(dueDate);
    const now = new Date();
    const daysLeft = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (progress >= 90) {
      return { label: "On Track", className: "bg-success/10 text-success" };
    } else if (daysLeft < 7 && progress < 75) {
      return { label: "At Risk", className: "bg-warning/10 text-warning" };
    } else if (daysLeft < 0) {
      return { label: "Delayed", className: "bg-destructive/10 text-destructive" };
    } else {
      return { label: "On Track", className: "bg-success/10 text-success" };
    }
  };

  const formatDueDate = (dueDate?: string) => {
    if (!dueDate) return 'No due date';
    return format(new Date(dueDate), 'MMM d');
  };

  return (
    <Card className="card-elevated">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FolderKanban className="h-5 w-5" />
          Active Projects
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {activeProjects.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No active projects. Create your first project to get started!</p>
            </div>
          ) : (
            activeProjects.map((project) => {
              const taskStats = getProjectTasks(project.id);
              const status = getProjectStatus(project.progress, project.due_date);
              
              return (
                <div key={project.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm">{project.name}</h4>
                    <Badge variant="outline" className={status.className}>
                      {status.label}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1">
                      <span className="text-muted-foreground">
                        {taskStats.completed}/{taskStats.total} tasks
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-1">
                        <div className="w-6 h-6 rounded-full bg-gradient-primary flex items-center justify-center text-white text-xs font-medium border-2 border-background">
                          {project.owner_id.slice(0, 2).toUpperCase()}
                        </div>
                      </div>
                      <span className="text-muted-foreground">Due {formatDueDate(project.due_date)}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}