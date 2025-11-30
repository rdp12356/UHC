import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Calendar, QrCode, Activity, ChevronRight, ShieldCheck, Home, Users, Droplets, Syringe, ArrowLeft, Star } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";

export default function CitizenDashboard() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user?.id) {
        try {
          const householdId = user.household_id || 'HH-12-0001';
          const data = await api.getCitizenProfile(householdId);
          setProfile(data || null);
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

  if (!profile) return <div className="text-center py-12 text-muted-foreground">Profile not found. Please contact your ASHA worker.</div>;

  const uhcId = profile.uhc_id || `UHC-${profile.household_id}`;
  const vaccinationRate = profile.vaccination_completion || 100;
  const cleanlinessScore = profile.cleanliness_score || 80;
  const familyHead = profile.family_head || "N/A";
  const familyName = profile.family_name || "N/A";
  const members = profile.members || [];
  
  const events = members.flatMap(m => 
    (m.vaccinations || []).map(v => ({
      date: v.vaccination_date,
      type: 'Vaccination',
      title: v.vaccine_name,
      details: `for ${m.name}`
    }))
  );
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate("/portals")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Citizen Dashboard</h1>
      </div>

      <div className="bg-gradient-to-r from-primary to-blue-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10 transform translate-x-10 -translate-y-10">
          <QrCode className="h-64 w-64" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h2 className="text-blue-100 font-medium text-sm uppercase tracking-wider mb-1">Unique Health Code</h2>
            <h1 className="text-3xl md:text-4xl font-bold font-mono tracking-wide" data-testid="text-uhc-id">{uhcId}</h1>
            <p className="mt-2 text-blue-100" data-testid="text-family-name">{familyName}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Badge variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm">
                <Home className="h-3 w-3 mr-1" /> {familyHead}
              </Badge>
              <Badge variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm">
                <Users className="h-3 w-3 mr-1" /> {members.length} Members
              </Badge>
            </div>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <QrCode className="h-24 w-24 text-slate-900" />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-l-4 border-l-emerald-500 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Syringe className="h-5 w-5 text-emerald-500" />
              Vaccination Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Completion Rate</span>
                <span className="font-bold text-emerald-600" data-testid="text-vaccination-rate">{vaccinationRate}%</span>
              </div>
              <Progress value={vaccinationRate} className="h-2" />
              <div className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg border border-emerald-100 dark:border-emerald-900">
                <div className="flex items-center gap-3">
                  <div className={`h-2 w-2 ${vaccinationRate >= 80 ? 'bg-emerald-500' : 'bg-amber-500'} rounded-full animate-pulse`} />
                  <span className={`font-medium ${vaccinationRate >= 80 ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'}`}>
                    {vaccinationRate >= 100 ? 'Fully Vaccinated' : vaccinationRate >= 80 ? 'Up to Date' : 'Pending Vaccinations'}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Droplets className="h-5 w-5 text-blue-500" />
              Cleanliness Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Current Score</span>
                <span className="font-bold text-blue-600" data-testid="text-cleanliness-score">{cleanlinessScore}/100</span>
              </div>
              <Progress value={cleanlinessScore} className="h-2" />
              <div className={`flex items-center justify-between p-3 rounded-lg border ${cleanlinessScore >= 80 ? 'bg-blue-50 dark:bg-blue-950/30 border-blue-100 dark:border-blue-900' : 'bg-amber-50 dark:bg-amber-950/30 border-amber-100 dark:border-amber-900'}`}>
                <div className="flex items-center gap-3">
                  <div className={`h-2 w-2 ${cleanlinessScore >= 80 ? 'bg-blue-500' : 'bg-amber-500'} rounded-full`} />
                  <span className={`font-medium ${cleanlinessScore >= 80 ? 'text-blue-700 dark:text-blue-400' : 'text-amber-700 dark:text-amber-400'}`}>
                    {cleanlinessScore >= 80 ? 'Good' : 'Needs Improvement'}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">Last Visit: {profile.last_visit || 'Today'}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Family Members
          </CardTitle>
        </CardHeader>
        <CardContent>
          {members.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">No members registered</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {members.map((member) => (
                <Link key={member.id} href={`/citizen/member/${member.id}`}>
                  <div className="border rounded-lg p-4 space-y-2 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer" data-testid={`member-card-${member.id}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-blue-600 hover:text-blue-700 hover:underline" data-testid={`text-member-name-${member.id}`}>{member.name}</h4>
                        <p className="text-sm text-muted-foreground">Age: {member.age} | {member.relation}</p>
                      </div>
                      <Badge variant={member.vaccinations?.length > 0 ? "default" : "outline"} className={member.vaccinations?.length > 0 ? "bg-emerald-500" : ""}>
                        {member.vaccinations?.length || 0} vaccines
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {member.vaccinations?.slice(0, 3).map((v) => (
                        <span key={v.id} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-xs">
                          {v.vaccine_name}
                        </span>
                      ))}
                      {member.vaccinations?.length > 3 && (
                        <span className="px-2 py-0.5 text-xs text-muted-foreground">+{member.vaccinations.length - 3} more</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-serif font-bold">Recent Vaccination Activity</h3>
          <Link href="/citizen/timeline">
            <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>
        
        <div className="space-y-3">
          {events.length === 0 ? (
            <p className="text-center text-muted-foreground py-6">No vaccination records yet</p>
          ) : (
            events.slice(0, 3).map((event, i) => (
              <Card key={i} className="shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex items-start gap-4">
                  <div className="mt-1 p-2 rounded-full shrink-0 bg-emerald-100 text-emerald-600">
                    <Syringe className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-medium text-base">{event.title}</h4>
                    <p className="text-sm text-muted-foreground">{event.details}</p>
                    <span className="text-xs text-muted-foreground mt-1 block">{event.date}</span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
