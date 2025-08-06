import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  Calendar,
  CheckCircle,
  Clock,
  TrendingUp,
  FolderKanban,
  Plus,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { CreateProjectDialog } from "@/components/projects/CreateProjectDialog";
import { CreateTaskDialog } from "@/components/tasks/CreateTaskDialog";

const stats = [
  {
    title: "Active Projects",
    value: "12",
    change: "+2 this week",
    icon: FolderKanban,
    color: "text-primary",
  },
  {
    title: "Tasks Completed",
    value: "89",
    change: "+12 today",
    icon: CheckCircle,
    color: "text-success",
  },
  {
    title: "Team Members",
    value: "24",
    change: "+3 this month",
    icon: Users,
    color: "text-warning",
  },
  {
    title: "Avg. Completion",
    value: "87%",
    change: "+5% vs last month",
    icon: TrendingUp,
    color: "text-primary",
  },
];

const recentTasks = [
  {
    id: 1,
    title: "Design new landing page",
    project: "Website Redesign",
    status: "in-progress",
    priority: "high",
    assignee: "Sarah Chen",
    dueDate: "Today",
  },
  {
    id: 2,
    title: "Implement user authentication",
    project: "Mobile App",
    status: "review",
    priority: "medium",
    assignee: "Mike Johnson",
    dueDate: "Tomorrow",
  },
  {
    id: 3,
    title: "Create social media assets",
    project: "Marketing Campaign",
    status: "todo",
    priority: "low",
    assignee: "Lisa Wang",
    dueDate: "This week",
  },
  {
    id: 4,
    title: "Database optimization",
    project: "Backend Updates",
    status: "done",
    priority: "high",
    assignee: "Alex Rodriguez",
    dueDate: "Completed",
  },
];

const activeProjects = [
  {
    name: "Website Redesign",
    progress: 75,
    tasks: { completed: 15, total: 20 },
    team: ["SC", "MJ", "LW"],
    status: "on-track",
    dueDate: "Dec 15",
  },
  {
    name: "Mobile App Development",
    progress: 45,
    tasks: { completed: 9, total: 20 },
    team: ["MJ", "AR", "SC"],
    status: "at-risk",
    dueDate: "Jan 30",
  },
  {
    name: "Marketing Campaign",
    progress: 90,
    tasks: { completed: 18, total: 20 },
    team: ["LW", "SC"],
    status: "on-track",
    dueDate: "Dec 5",
  },
];

export default function Dashboard() {
  const { user, profile } = useAuth();
  
  const getDisplayName = () => {
    if (profile?.display_name) return profile.display_name;
    if (user?.email) return user.email.split('@')[0];
    return 'User';
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      todo: { label: "To Do", className: "status-todo" },
      "in-progress": { label: "In Progress", className: "status-progress" },
      review: { label: "Review", className: "status-review" },
      done: { label: "Done", className: "status-done" },
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
      high: "text-destructive",
      medium: "text-warning",
      low: "text-muted-foreground",
    };
    return colors[priority as keyof typeof colors];
  };

  const getProjectStatus = (status: string) => {
    const statusConfig = {
      "on-track": { label: "On Track", className: "bg-success/10 text-success" },
      "at-risk": { label: "At Risk", className: "bg-warning/10 text-warning" },
      delayed: { label: "Delayed", className: "bg-destructive/10 text-destructive" },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <Badge variant="outline" className={config.className}>
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{getGreeting()}, {getDisplayName()}! 👋</h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening with your projects today.
          </p>
        </div>
        <CreateProjectDialog />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="card-elevated animate-slideInLeft" style={{animationDelay: `${index * 0.1}s`}}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Tasks */}
        <Card className="lg:col-span-2 card-elevated">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Tasks
            </CardTitle>
            <Button variant="ghost" size="sm">
              View All <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTasks.map((task) => (
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
                      <span>{task.project}</span>
                      <span>•</span>
                      <span>{task.assignee}</span>
                      <span>•</span>
                      <span>{task.dueDate}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(task.status)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Active Projects */}
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderKanban className="h-5 w-5" />
              Active Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {activeProjects.map((project, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm">{project.name}</h4>
                    {getProjectStatus(project.status)}
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
                        {project.tasks.completed}/{project.tasks.total} tasks
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-1">
                        {project.team.map((member, idx) => (
                          <div
                            key={idx}
                            className="w-6 h-6 rounded-full bg-gradient-primary flex items-center justify-center text-white text-xs font-medium border-2 border-background"
                          >
                            {member}
                          </div>
                        ))}
                      </div>
                      <span className="text-muted-foreground">Due {project.dueDate}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <CreateTaskDialog />
            <CreateProjectDialog />
            <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
              <Users className="h-6 w-6" />
              <span className="text-sm">Invite Team</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
              <Calendar className="h-6 w-6" />
              <span className="text-sm">Schedule Meeting</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}