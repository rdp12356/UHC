import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Syringe, Stethoscope, FileText } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function CitizenTimeline() {
  const { user } = useAuth();
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (user?.id) {
        const data = await api.getCitizenProfile(user.id);
        if (data) setTimeline(data.timeline);
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const getIcon = (type) => {
    switch (type) {
      case 'Vaccination': return <Syringe className="h-5 w-5" />;
      case 'Visit': return <Stethoscope className="h-5 w-5" />;
      case 'Lab': return <Activity className="h-5 w-5" />;
      default: return <FileText className="h-5 w-5" />;
    }
  };

  const getColor = (type) => {
    switch (type) {
      case 'Vaccination': return 'bg-emerald-500';
      case 'Visit': return 'bg-blue-500';
      case 'Lab': return 'bg-purple-500';
      default: return 'bg-slate-500';
    }
  };

  if (loading) {
    return <div className="space-y-4">
      {[1,2,3].map(i => <Skeleton key={i} className="h-24 w-full" />)}
    </div>;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-serif font-bold">Health Timeline</h1>
        <Badge variant="outline" className="text-muted-foreground">Total Events: {timeline.length}</Badge>
      </div>

      <div className="relative border-l-2 border-muted ml-3 space-y-8 pb-8">
        {timeline.map((event, index) => (
          <div key={index} className="relative pl-8 group">
            <div className={`absolute -left-[9px] top-0 h-4 w-4 rounded-full border-2 border-white dark:border-slate-950 ${getColor(event.type)} ring-2 ring-offset-2 ring-offset-white dark:ring-offset-slate-950 ring-${getColor(event.type).replace('bg-', '')}/20`} />
            
            <Card className="shadow-sm hover:shadow-md transition-all group-hover:-translate-y-1 duration-300">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <Badge variant="secondary" className="mb-2">{event.type}</Badge>
                    <CardTitle className="text-lg">{event.title}</CardTitle>
                  </div>
                  <span className="text-sm font-medium text-muted-foreground bg-muted px-2 py-1 rounded">
                    {event.date}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{event.details}</p>
              </CardContent>
            </Card>
          </div>
        ))}
        
        {timeline.length === 0 && (
          <div className="pl-8 text-muted-foreground">No health records found.</div>
        )}
      </div>
    </div>
  );
}
