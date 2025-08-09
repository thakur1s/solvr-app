import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderKanban, CheckCircle, Users, TrendingUp } from "lucide-react";
import { useProjects } from "@/hooks/useProjects";
import { useTasks } from "@/hooks/useTasks";
import { useAuth } from "@/contexts/AuthContext";

export function StatsGrid() {
  const { projects } = useProjects();
  const { tasks } = useTasks();
  const { user } = useAuth();

  const activeProjects = projects.filter(p => p.status === 'in_progress' || p.status === 'planning');
  const completedTasks = tasks.filter(t => t.status === 'completed');
  const totalProgress = projects.reduce((acc, p) => acc + p.progress, 0);
  const avgCompletion = projects.length > 0 ? Math.round(totalProgress / projects.length) : 0;

  const stats = [
    {
      title: "Active Projects",
      value: activeProjects.length.toString(),
      change: "+2 this week",
      icon: FolderKanban,
      color: "text-primary",
    },
    {
      title: "Tasks Completed",
      value: completedTasks.length.toString(),
      change: "+12 today",
      icon: CheckCircle,
      color: "text-success",
    },
    {
      title: "Team Members",
      value: "1", // Current user only, can be extended with team data
      change: "+3 this month",
      icon: Users,
      color: "text-warning",
    },
    {
      title: "Avg. Completion",
      value: `${avgCompletion}%`,
      change: "+5% vs last month",
      icon: TrendingUp,
      color: "text-primary",
    },
  ];

  return (
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
  );
}