import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Calendar, 
  DollarSign, 
  Users, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Edit
} from "lucide-react";
import { Project } from "@/hooks/useProjects";
import { useTasks } from "@/hooks/useTasks";
import { format } from "date-fns";

interface ProjectDetailsDialogProps {
  project: Project;
  trigger: React.ReactNode;
}

export function ProjectDetailsDialog({ project, trigger }: ProjectDetailsDialogProps) {
  const [open, setOpen] = useState(false);
  const { tasks } = useTasks(project.id);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      planning: { label: "Planning", className: "bg-muted text-muted-foreground" },
      in_progress: { label: "In Progress", className: "bg-primary/10 text-primary" },
      completed: { label: "Completed", className: "bg-success/10 text-success" },
      on_hold: { label: "On Hold", className: "bg-warning/10 text-warning" },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <Badge variant="outline" className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      low: { label: "Low", className: "bg-success/10 text-success" },
      medium: { label: "Medium", className: "bg-warning/10 text-warning" },
      high: { label: "High", className: "bg-destructive/10 text-destructive" },
      urgent: { label: "Urgent", className: "bg-destructive text-destructive-foreground" },
    };
    
    const config = priorityConfig[priority as keyof typeof priorityConfig];
    return (
      <Badge variant="outline" className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const taskStats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    todo: tasks.filter(t => t.status === 'todo').length,
  };

  const completionRate = taskStats.total > 0 ? Math.round((taskStats.completed / taskStats.total) * 100) : 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl">{project.name}</DialogTitle>
              <DialogDescription className="mt-1">
                Project details and progress overview
              </DialogDescription>
            </div>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Project Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              {getStatusBadge(project.status)}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Priority</label>
              {getPriorityBadge(project.priority)}
            </div>
          </div>

          {project.description && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <p className="text-sm text-muted-foreground">{project.description}</p>
            </div>
          )}

          {/* Dates and Budget */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {project.start_date && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Start Date</p>
                  <p className="text-sm font-medium">{format(new Date(project.start_date), 'MMM d, yyyy')}</p>
                </div>
              </div>
            )}
            
            {project.due_date && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Due Date</p>
                  <p className="text-sm font-medium">{format(new Date(project.due_date), 'MMM d, yyyy')}</p>
                </div>
              </div>
            )}
            
            {project.budget && (
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Budget</p>
                  <p className="text-sm font-medium">${project.budget.toLocaleString()}</p>
                </div>
              </div>
            )}
          </div>

          {/* Progress */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Progress Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Overall Progress</span>
                  <span className="font-medium">{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-2" />
              </div>

              <div className="grid grid-cols-4 gap-4 pt-2">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span className="text-lg font-bold text-success">{taskStats.completed}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Clock className="h-4 w-4 text-warning" />
                    <span className="text-lg font-bold text-warning">{taskStats.inProgress}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">In Progress</p>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    <span className="text-lg font-bold text-muted-foreground">{taskStats.todo}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">To Do</p>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Users className="h-4 w-4 text-primary" />
                    <span className="text-lg font-bold text-primary">{taskStats.total}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Total Tasks</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Tasks */}
          {tasks.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Recent Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tasks.slice(0, 5).map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium text-sm">{task.title}</h4>
                        <p className="text-xs text-muted-foreground">{task.description}</p>
                      </div>
                      <Badge variant="outline" className={
                        task.status === 'completed' ? 'bg-success/10 text-success' :
                        task.status === 'in_progress' ? 'bg-warning/10 text-warning' :
                        'bg-muted text-muted-foreground'
                      }>
                        {task.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}