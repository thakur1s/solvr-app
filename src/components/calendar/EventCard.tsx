import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

interface EventCardProps {
  event: {
    id: number;
    title: string;
    project: string;
    time: string;
    duration: string;
    attendees: string[];
    type: string;
    status: string;
  };
}

export function EventCard({ event }: EventCardProps) {
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

  return (
    <div className="flex items-start gap-4 p-4 rounded-lg border bg-card/50 hover:bg-card transition-colors">
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
  );
}