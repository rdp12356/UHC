import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, AlertTriangle, ShieldAlert, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

export default function GovernmentDashboard() {
  const [, navigate] = useLocation();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.getDashboardStats().then(setStats);
  }, []);

  if (!stats) return <Skeleton className="h-96 w-full" />;

  // Mock data for charts since the basic stats are simple
  const diseaseData = [
    { name: 'Dengue', cases: 400 },
    { name: 'Malaria', cases: 300 },
    { name: 'Typhoid', cases: 300 },
    { name: 'Covid', cases: 200 },
  ];

  const vaccData = [
    { name: 'Completed', value: 75, color: '#10b981' },
    { name: 'Pending', value: 25, color: '#ef4444' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate("/portals")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-serif font-bold">National Health Dashboard</h1>
          <p className="text-muted-foreground">Real-time health metrics and resource monitoring.</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="border-t-4 border-t-blue-500 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.activeCases.toLocaleString()}</div>
            <p className="text-xs text-emerald-600 flex items-center mt-1">
              ↓ 12% from last week
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-t-4 border-t-emerald-500 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Vaccinations Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.vaccinationsToday.toLocaleString()}</div>
            <p className="text-xs text-emerald-600 flex items-center mt-1">
              ↑ 5% vs target
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-t-4 border-t-orange-500 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Sanitation Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.pendingSanitation}</div>
            <p className="text-xs text-red-500 flex items-center mt-1">
              Needs immediate attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Disease Distribution (Monthly)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={diseaseData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: 'transparent' }} />
                  <Bar dataKey="cases" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} barSize={50} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Vaccination Coverage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full flex justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={vaccData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {vaccData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 text-sm">
              {vaccData.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span>{item.name} ({item.value}%)</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Management Tools */}
      <div className="border-t pt-8">
        <h2 className="text-2xl font-bold mb-6">Government Tools</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition-all cursor-pointer border-l-4 border-l-blue-500" onClick={() => navigate("/gov/asha-management")}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  ASHA Worker Management
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Suspend or reactivate ASHA workers, monitor performance</p>
              <Button variant="ghost" className="mt-4 gap-2" data-testid="button-go-asha-mgmt">
                Manage → 
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all cursor-pointer border-l-4 border-l-red-500" onClick={() => navigate("/gov/alerts")}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Health Alerts
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">View critical health alerts and emergency cases</p>
              <Button variant="ghost" className="mt-4 gap-2" data-testid="button-go-alerts">
                View Alerts →
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all cursor-pointer border-l-4 border-l-purple-500" onClick={() => navigate("/gov/admin")}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5" />
                  Admin Panel
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Configure system settings and ward management</p>
              <Button variant="ghost" className="mt-4 gap-2" data-testid="button-go-admin">
                Admin Panel →
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
