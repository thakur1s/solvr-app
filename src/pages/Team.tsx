import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  Mail,
  Phone,
  MapPin,
  Calendar,
  Users,
  MoreHorizontal,
  UserPlus,
} from "lucide-react";

const teamMembers = [
  {
    id: 1,
    name: "Sarah Chen",
    email: "sarah.chen@company.com",
    role: "Product Designer",
    department: "Design",
    avatar: "SC",
    status: "active",
    location: "San Francisco, CA",
    joinDate: "Jan 2023",
    phone: "+1 (555) 123-4567",
    projects: ["Website Redesign", "Mobile App", "Marketing Campaign"],
    completedTasks: 45,
    activeProjects: 3,
    skills: ["UI/UX Design", "Figma", "Prototyping"],
  },
  {
    id: 2,
    name: "Mike Johnson",
    email: "mike.johnson@company.com",
    role: "Senior Developer",
    department: "Engineering",
    avatar: "MJ",
    status: "active",
    location: "Austin, TX",
    joinDate: "Mar 2022",
    phone: "+1 (555) 234-5678",
    projects: ["Website Redesign", "Mobile App", "Backend Infrastructure"],
    completedTasks: 67,
    activeProjects: 3,
    skills: ["React", "Node.js", "TypeScript"],
  },
  {
    id: 3,
    name: "Lisa Wang",
    email: "lisa.wang@company.com",
    role: "Marketing Manager",
    department: "Marketing",
    avatar: "LW",
    status: "active",
    location: "New York, NY",
    joinDate: "Jun 2022",
    phone: "+1 (555) 345-6789",
    projects: ["Marketing Campaign", "Customer Support Portal"],
    completedTasks: 38,
    activeProjects: 2,
    skills: ["Content Strategy", "Analytics", "SEO"],
  },
  {
    id: 4,
    name: "Alex Rodriguez",
    email: "alex.rodriguez@company.com",
    role: "DevOps Engineer",
    department: "Engineering",
    avatar: "AR",
    status: "active",
    location: "Seattle, WA",
    joinDate: "Sep 2021",
    phone: "+1 (555) 456-7890",
    projects: ["Mobile App", "Backend Infrastructure", "Data Analytics"],
    completedTasks: 52,
    activeProjects: 3,
    skills: ["AWS", "Docker", "Kubernetes"],
  },
  {
    id: 5,
    name: "Emma Thompson",
    email: "emma.thompson@company.com",
    role: "Project Manager",
    department: "Operations",
    avatar: "ET",
    status: "away",
    location: "Chicago, IL",
    joinDate: "Nov 2023",
    phone: "+1 (555) 567-8901",
    projects: ["Website Redesign"],
    completedTasks: 23,
    activeProjects: 1,
    skills: ["Agile", "Scrum", "Leadership"],
  },
  {
    id: 6,
    name: "David Kim",
    email: "david.kim@company.com",
    role: "Data Analyst",
    department: "Analytics",
    avatar: "DK",
    status: "inactive",
    location: "Remote",
    joinDate: "Feb 2023",
    phone: "+1 (555) 678-9012",
    projects: ["Data Analytics Dashboard"],
    completedTasks: 15,
    activeProjects: 1,
    skills: ["Python", "SQL", "Tableau"],
  },
];

export default function Team() {
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredMembers = teamMembers.filter((member) => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter === "all" || member.department === departmentFilter;
    const matchesStatus = statusFilter === "all" || member.status === statusFilter;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: "Active", className: "bg-success/10 text-success border-success/20" },
      away: { label: "Away", className: "bg-warning/10 text-warning border-warning/20" },
      inactive: { label: "Inactive", className: "bg-muted text-muted-foreground border-muted" },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <Badge variant="outline" className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const departments = [...new Set(teamMembers.map(member => member.department))];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Team</h1>
          <p className="text-muted-foreground mt-1">
            Manage your team members and their projects.
          </p>
        </div>
        <Button className="btn-gradient">
          <UserPlus className="h-4 w-4 mr-2" />
          Invite Member
        </Button>
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="card-elevated">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{teamMembers.length}</p>
                <p className="text-sm text-muted-foreground">Total Members</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-elevated">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10">
                <Users className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{teamMembers.filter(m => m.status === 'active').length}</p>
                <p className="text-sm text-muted-foreground">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-elevated">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/10">
                <Calendar className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{teamMembers.filter(m => m.status === 'away').length}</p>
                <p className="text-sm text-muted-foreground">Away</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-elevated">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{departments.length}</p>
                <p className="text-sm text-muted-foreground">Departments</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="card-elevated">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search team members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="away">Away</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredMembers.map((member, index) => (
          <Card key={member.id} className="card-elevated animate-slideInLeft" style={{animationDelay: `${index * 0.1}s`}}>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-gradient-primary text-white font-semibold">
                      {member.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{member.name}</h3>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Status and Department */}
              <div className="flex items-center gap-2">
                {getStatusBadge(member.status)}
                <Badge variant="outline">{member.department}</Badge>
              </div>

              {/* Contact Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{member.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{member.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{member.location}</span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                <div className="text-center">
                  <p className="text-xl font-bold text-primary">{member.completedTasks}</p>
                  <p className="text-xs text-muted-foreground">Tasks Done</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-primary">{member.activeProjects}</p>
                  <p className="text-xs text-muted-foreground">Active Projects</p>
                </div>
              </div>

              {/* Skills */}
              <div>
                <p className="text-sm font-medium mb-2">Skills</p>
                <div className="flex flex-wrap gap-1">
                  {member.skills.slice(0, 3).map((skill, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1">
                  <Mail className="h-4 w-4 mr-2" />
                  Message
                </Button>
                <Button variant="outline" className="flex-1">
                  View Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredMembers.length === 0 && (
        <Card className="card-elevated">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No team members found</h3>
            <p className="text-muted-foreground text-center mb-4">
              Try adjusting your search or filters, or invite new team members.
            </p>
            <Button className="btn-gradient">
              <UserPlus className="h-4 w-4 mr-2" />
              Invite Team Member
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}