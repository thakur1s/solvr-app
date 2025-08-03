import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Plus, ChevronLeft, ChevronRight, Clock, Users } from "lucide-react";

const events = [
  {
    id: 1,
    title: "Project Review Meeting",
    project: "Website Redesign",
    time: "09:00 AM",
    duration: "1h",
    attendees: ["Sarah Chen", "Mike Johnson", "Lisa Wang"],
    type: "meeting",
    status: "confirmed",
  },
  {
    id: 2,
    title: "Design System Update",
    project: "Mobile App",
    time: "02:00 PM",
    duration: "2h",
    attendees: ["Sarah Chen", "Alex Rodriguez"],
    type: "task",
    status: "in-progress",
  },
  {
    id: 3,
    title: "Sprint Planning",
    project: "Backend Infrastructure",
    time: "10:00 AM",
    duration: "1h 30m",
    attendees: ["Mike Johnson", "Alex Rodriguez", "Emma Thompson"],
    type: "meeting",
    status: "confirmed",
  },
  {
    id: 4,
    title: "Marketing Campaign Launch",
    project: "Marketing Campaign Q4",
    time: "03:00 PM",
    duration: "30m",
    attendees: ["Lisa Wang", "Sarah Chen"],
    type: "milestone",
    status: "confirmed",
  },
];

const upcomingDeadlines = [
  {
    project: "Website Redesign",
    task: "Final design approval",
    dueDate: "Dec 15, 2024",
    priority: "high",
    daysLeft: 3,
  },
  {
    project: "Marketing Campaign",
    task: "Campaign materials ready",
    dueDate: "Dec 5, 2024",
    priority: "high",
    daysLeft: -7, // Overdue
  },
  {
    project: "Mobile App",
    task: "Beta testing complete",
    dueDate: "Jan 30, 2025",
    priority: "medium",
    daysLeft: 45,
  },
  {
    project: "Backend Infrastructure",
    task: "Performance optimization",
    dueDate: "Feb 15, 2025",
    priority: "medium",
    daysLeft: 61,
  },
];

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedView, setSelectedView] = useState("month");

  const getEventTypeBadge = (type: string) => {
    const typeConfig = {
      meeting: { label: "Meeting", className: "bg-primary/10 text-primary border-primary/20" },
      task: { label: "Task", className: "bg-warning/10 text-warning border-warning/20" },
      milestone: { label: "Milestone", className: "bg-success/10 text-success border-success/20" },
    };
    
    const config = typeConfig[type as keyof typeof typeConfig];
    return (
      <Badge variant="outline" className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      confirmed: { label: "Confirmed", className: "bg-success/10 text-success border-success/20" },
      "in-progress": { label: "In Progress", className: "bg-warning/10 text-warning border-warning/20" },
      pending: { label: "Pending", className: "bg-muted text-muted-foreground border-muted" },
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

  const getDeadlineStatus = (daysLeft: number) => {
    if (daysLeft < 0) {
      return { className: "bg-destructive/10 text-destructive border-destructive/20", label: "Overdue" };
    } else if (daysLeft <= 7) {
      return { className: "bg-warning/10 text-warning border-warning/20", label: "Due Soon" };
    } else {
      return { className: "bg-success/10 text-success border-success/20", label: "On Track" };
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Calendar</h1>
          <p className="text-muted-foreground mt-1">
            Track deadlines, meetings, and important project milestones.
          </p>
        </div>
        <Button className="btn-gradient">
          <Plus className="h-4 w-4 mr-2" />
          New Event
        </Button>
      </div>

      {/* Calendar Controls */}
      <Card className="card-elevated">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <h2 className="text-xl font-semibold">{formatDate(currentDate)}</h2>
                <Button variant="outline" size="sm">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <Button variant="outline" size="sm">
                Today
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant={selectedView === "week" ? "default" : "outline"} 
                size="sm"
                onClick={() => setSelectedView("week")}
              >
                Week
              </Button>
              <Button 
                variant={selectedView === "month" ? "default" : "outline"} 
                size="sm"
                onClick={() => setSelectedView("month")}
              >
                Month
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Events */}
        <Card className="lg:col-span-2 card-elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Today's Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="flex items-start gap-4 p-4 rounded-lg border bg-card/50 hover:bg-card transition-colors"
                >
                  <div className="flex flex-col items-center gap-1 min-w-[60px]">
                    <div className="text-sm font-medium">{event.time}</div>
                    <div className="text-xs text-muted-foreground">{event.duration}</div>
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{event.title}</h4>
                      {getEventTypeBadge(event.type)}
                      {getStatusBadge(event.status)}
                    </div>
                    
                    <p className="text-sm text-muted-foreground">{event.project}</p>
                    
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <div className="flex -space-x-1">
                        {event.attendees.slice(0, 3).map((attendee, idx) => (
                          <div
                            key={idx}
                            className="w-6 h-6 rounded-full bg-gradient-primary flex items-center justify-center text-white text-xs font-medium border-2 border-background"
                            title={attendee}
                          >
                            {attendee.split(' ').map(n => n[0]).join('')}
                          </div>
                        ))}
                        {event.attendees.length > 3 && (
                          <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium border-2 border-background">
                            +{event.attendees.length - 3}
                          </div>
                        )}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {event.attendees.length} attendee{event.attendees.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Button variant="outline" size="sm">
                      Join
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Deadlines */}
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Upcoming Deadlines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingDeadlines.map((deadline, index) => {
                const status = getDeadlineStatus(deadline.daysLeft);
                
                return (
                  <div
                    key={index}
                    className="p-4 rounded-lg border bg-card/50 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">{deadline.task}</h4>
                      <Badge variant="outline" className={status.className}>
                        {status.label}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">{deadline.project}</p>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Due: {deadline.dueDate}</span>
                      <span className={`font-medium ${getPriorityColor(deadline.priority)}`}>
                        {deadline.priority.toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      {deadline.daysLeft < 0 
                        ? `${Math.abs(deadline.daysLeft)} days overdue`
                        : deadline.daysLeft === 0 
                        ? "Due today"
                        : `${deadline.daysLeft} days remaining`
                      }
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calendar Grid Placeholder */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle>Calendar View</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="aspect-[4/3] border-2 border-dashed border-muted rounded-lg flex items-center justify-center">
            <div className="text-center">
              <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Calendar Grid</h3>
              <p className="text-muted-foreground">
                Interactive calendar view coming soon
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}