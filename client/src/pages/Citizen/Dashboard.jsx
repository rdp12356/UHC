import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, QrCode, Activity, ChevronRight, ShieldCheck } from "lucide-react";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";

export default function CitizenDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user?.id) {
        try {
          const data = await api.getCitizenProfile('HH-12-0001');
          setProfile(data || {
            uhc_id: 'UHC-2025-8891',
            name: user.full_name,
            dob: '1985-06-15',
            gender: 'Male',
            ward: '12',
            timeline: [],
            members: []
          });
        } catch (err) {
          console.error('Failed to fetch profile:', err);
        }
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  if (loading) {
    return <div className="space-y-4">
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>;
  }

  if (!profile) return <div>Profile not found.</div>;

  const uhcId = profile.uhc_id || `UHC-2025-${Math.random().toString().slice(2, 6)}`;
  
  return (
    <div className="space-y-6">
      {/* ID Card Section */}
      <div className="bg-gradient-to-r from-primary to-blue-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10 transform translate-x-10 -translate-y-10">
          <QrCode className="h-64 w-64" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h2 className="text-blue-100 font-medium text-sm uppercase tracking-wider mb-1">Unique Health Code</h2>
            <h1 className="text-3xl md:text-4xl font-bold font-mono tracking-wide">{uhcId}</h1>
            <div className="mt-4 flex flex-wrap gap-3">
              <Badge variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm">
                {profile.gender}
              </Badge>
              <Badge variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm">
                DOB: {profile.dob}
              </Badge>
              <Badge variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm">
                Ward {profile.ward}
              </Badge>
            </div>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <QrCode className="h-24 w-24 text-slate-900" />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Quick Stats / Next Actions */}
        <Card className="border-l-4 border-l-emerald-500 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-500" />
              Vaccination Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Your vaccination record is up to date.
            </p>
            <div className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg border border-emerald-100 dark:border-emerald-900">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="font-medium text-emerald-700 dark:text-emerald-400">Fully Vaccinated</span>
              </div>
              <span className="text-xs text-muted-foreground">Last: 10 Nov 2024</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-500" />
              Upcoming Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6 text-muted-foreground">
              <p>No upcoming appointments scheduled.</p>
              <Button variant="link" className="mt-2 h-auto p-0 text-primary">
                Schedule Checkup
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Preview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-serif font-bold">Recent Activity</h3>
          <Link href="/citizen/timeline">
            <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>
        
        <div className="space-y-3">
          {profile.timeline.slice(0, 2).map((event, i) => (
            <Card key={i} className="shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4 flex items-start gap-4">
                <div className={`mt-1 p-2 rounded-full shrink-0 ${
                  event.type === 'Vaccination' ? 'bg-emerald-100 text-emerald-600' : 
                  event.type === 'Visit' ? 'bg-blue-100 text-blue-600' : 
                  'bg-orange-100 text-orange-600'
                }`}>
                  <Activity className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-medium text-base">{event.title}</h4>
                  <p className="text-sm text-muted-foreground">{event.details}</p>
                  <span className="text-xs text-muted-foreground mt-1 block">{event.date}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
