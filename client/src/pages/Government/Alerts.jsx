import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, MapPin, Bell } from "lucide-react";

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    api.getDashboardStats().then(data => {
      if (data && data.alerts) setAlerts(data.alerts);
    });
  }, []);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'High': return 'border-l-destructive bg-red-50 dark:bg-red-950/20';
      case 'Medium': return 'border-l-orange-500 bg-orange-50 dark:bg-orange-950/20';
      default: return 'border-l-blue-500 bg-blue-50 dark:bg-blue-950/20';
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
       <div className="flex items-center gap-3">
         <div className="p-3 bg-red-100 text-red-600 rounded-full">
           <Bell className="h-6 w-6" />
         </div>
         <div>
           <h1 className="text-2xl font-serif font-bold">Active Alerts</h1>
           <p className="text-muted-foreground">Critical updates requiring immediate intervention.</p>
         </div>
       </div>

       <div className="space-y-4">
         {alerts.map((alert) => (
           <Card key={alert.id} className={`border-l-4 shadow-sm ${getSeverityColor(alert.severity)}`}>
             <CardContent className="p-4 flex items-start gap-4">
               <div className="mt-1">
                 <AlertTriangle className={`h-5 w-5 ${
                   alert.severity === 'High' ? 'text-red-600' : 
                   alert.severity === 'Medium' ? 'text-orange-600' : 'text-blue-600'
                 }`} />
               </div>
               <div className="flex-grow">
                 <div className="flex justify-between items-start">
                   <h3 className="font-bold text-lg">{alert.type} Warning</h3>
                   <Badge variant={alert.severity === 'High' ? 'destructive' : 'outline'}>
                     {alert.severity} Priority
                   </Badge>
                 </div>
                 <p className="text-slate-700 dark:text-slate-300 mt-1">{alert.message}</p>
                 <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                   <MapPin className="h-3 w-3" /> New Delhi Region • Just now
                 </div>
               </div>
             </CardContent>
           </Card>
         ))}
       </div>
    </div>
  );
}
