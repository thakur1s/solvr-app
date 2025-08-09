import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, ArrowRight } from "lucide-react";
import { useTasks } from "@/hooks/useTasks";
import { useProjects } from "@/hooks/useProjects";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

export function RecentTasks() {
  const { tasks } = useTasks();
  const { projects } = useProjects();
  const navigate = useNavigate();

  // Get recent tasks (last 5)
  const recentTasks = tasks.slice(0, 5);

  const getProjectName = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    return project?.name || 'Unknown Project';
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      todo: { label: "To Do", className: "status-todo" },
      in_progress: { label: "In Progress", className: "status-progress" },
      completed: { label: "Completed", className: "status-done" },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <Badge variant="outline" className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      urgent: "text-destructive",
      high: "text-destructive",
      medium: "text-warning",
      low: "text-muted-foreground",
    };
    return colors[priority as keyof typeof colors];
  };

  const formatDueDate = (dueDate?: string) => {
    if (!dueDate) return 'No due date';
    const date = new Date(dueDate);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    if (diffDays > 0 && diffDays <= 7) return `Due in ${diffDays} days`;
    if (diffDays < 0) return `Overdue by ${Math.abs(diffDays)} days`;
    return format(date, 'MMM d');
  };

  return (
    <Card className="lg:col-span-2 card-elevated">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recent Tasks
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={() => navigate('/tasks')}>
          View All <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentTasks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No tasks yet. Create your first task to get started!</p>
            </div>
          ) : (
            recentTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-4 rounded-lg border bg-card/50 hover:bg-card transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{task.title}</h4>
                    <span className={`text-xs font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{getProjectName(task.project_id)}</span>
                    <span>•</span>
                    <span>{formatDueDate(task.due_date)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(task.status)}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}