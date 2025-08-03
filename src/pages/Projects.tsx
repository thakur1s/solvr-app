import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Search,
  Filter,
  Calendar,
  Users,
  MoreHorizontal,
  FolderKanban,
} from "lucide-react";

const projects = [
  {
    id: 1,
    name: "Website Redesign",
    description: "Complete overhaul of company website with modern design and improved UX",
    status: "active",
    priority: "high",
    progress: 75,
    tasks: { completed: 15, total: 20 },
    team: [
      { name: "Sarah Chen", avatar: "SC" },
      { name: "Mike Johnson", avatar: "MJ" },
      { name: "Lisa Wang", avatar: "LW" },
    ],
    dueDate: "Dec 15, 2024",
    category: "Design",
    budget: "$45,000",
  },
  {
    id: 2,
    name: "Mobile App Development",
    description: "iOS and Android app for customer engagement and sales",
    status: "active",
    priority: "high",
    progress: 45,
    tasks: { completed: 9, total: 20 },
    team: [
      { name: "Mike Johnson", avatar: "MJ" },
      { name: "Alex Rodriguez", avatar: "AR" },
      { name: "Sarah Chen", avatar: "SC" },
    ],
    dueDate: "Jan 30, 2025",
    category: "Development",
    budget: "$120,000",
  },
  {
    id: 3,
    name: "Marketing Campaign Q4",
    description: "Holiday season marketing push across all channels",
    status: "active",
    priority: "medium",
    progress: 90,
    tasks: { completed: 18, total: 20 },
    team: [
      { name: "Lisa Wang", avatar: "LW" },
      { name: "Sarah Chen", avatar: "SC" },
    ],
    dueDate: "Dec 5, 2024",
    category: "Marketing",
    budget: "$25,000",
  },
  {
    id: 4,
    name: "Backend Infrastructure",
    description: "Scalability improvements and performance optimization",
    status: "planning",
    priority: "medium",
    progress: 20,
    tasks: { completed: 4, total: 20 },
    team: [
      { name: "Alex Rodriguez", avatar: "AR" },
      { name: "Mike Johnson", avatar: "MJ" },
    ],
    dueDate: "Feb 15, 2025",
    category: "Development",
    budget: "$80,000",
  },
  {
    id: 5,
    name: "Customer Support Portal",
    description: "Self-service portal for customer support and documentation",
    status: "completed",
    priority: "low",
    progress: 100,
    tasks: { completed: 12, total: 12 },
    team: [
      { name: "Lisa Wang", avatar: "LW" },
      { name: "Sarah Chen", avatar: "SC" },
    ],
    dueDate: "Nov 30, 2024",
    category: "Support",
    budget: "$35,000",
  },
  {
    id: 6,
    name: "Data Analytics Dashboard",
    description: "Real-time analytics and reporting dashboard for executives",
    status: "on-hold",
    priority: "low",
    progress: 10,
    tasks: { completed: 2, total: 20 },
    team: [
      { name: "Alex Rodriguez", avatar: "AR" },
    ],
    dueDate: "TBD",
    category: "Analytics",
    budget: "$60,000",
  },
];

export default function Projects() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || project.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || project.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: "Active", className: "bg-success/10 text-success border-success/20" },
      planning: { label: "Planning", className: "bg-warning/10 text-warning border-warning/20" },
      completed: { label: "Completed", className: "bg-primary/10 text-primary border-primary/20" },
      "on-hold": { label: "On Hold", className: "bg-muted text-muted-foreground border-muted" },
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
      high: { label: "High", className: "bg-destructive/10 text-destructive border-destructive/20" },
      medium: { label: "Medium", className: "bg-warning/10 text-warning border-warning/20" },
      low: { label: "Low", className: "bg-muted text-muted-foreground border-muted" },
    };
    
    const config = priorityConfig[priority as keyof typeof priorityConfig];
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
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track all your team's projects in one place.
          </p>
        </div>
        <Button className="btn-gradient">
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* Filters */}
      <Card className="card-elevated">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="planning">Planning</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="on-hold">On Hold</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProjects.map((project, index) => (
          <Card key={project.id} className="card-elevated animate-slideInLeft" style={{animationDelay: `${index * 0.1}s`}}>
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-1">{project.name}</CardTitle>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {project.description}
                  </p>
                </div>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Status and Priority */}
              <div className="flex items-center gap-2">
                {getStatusBadge(project.status)}
                {getPriorityBadge(project.priority)}
              </div>

              {/* Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-2" />
                <div className="text-xs text-muted-foreground">
                  {project.tasks.completed} of {project.tasks.total} tasks completed
                </div>
              </div>

              {/* Team */}
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <div className="flex -space-x-1">
                  {project.team.map((member, idx) => (
                    <div
                      key={idx}
                      className="w-6 h-6 rounded-full bg-gradient-primary flex items-center justify-center text-white text-xs font-medium border-2 border-background"
                      title={member.name}
                    >
                      {member.avatar}
                    </div>
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {project.team.length} member{project.team.length !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{project.dueDate}</span>
                </div>
                <div className="text-sm font-medium text-foreground">
                  {project.budget}
                </div>
              </div>

              {/* Action Button */}
              <Button variant="outline" className="w-full">
                <FolderKanban className="h-4 w-4 mr-2" />
                View Project
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <Card className="card-elevated">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FolderKanban className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No projects found</h3>
            <p className="text-muted-foreground text-center mb-4">
              Try adjusting your search or filters, or create a new project.
            </p>
            <Button className="btn-gradient">
              <Plus className="h-4 w-4 mr-2" />
              Create Project
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}