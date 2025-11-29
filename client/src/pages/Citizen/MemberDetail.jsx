import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRoute, useLocation, Link } from "wouter";
import { api } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, User, Calendar, Heart, Syringe, Info } from "lucide-react";

export default function MemberDetail() {
  const { user } = useAuth();
  const [, params] = useRoute("/citizen/member/:memberId");
  const [, setLocation] = useLocation();
  const [member, setMember] = useState(null);
  const [household, setHousehold] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const householdId = user?.household_id || 'HH-12-0001';
        const data = await api.getCitizenProfile(householdId);
        if (data) {
          setHousehold(data);
          const found = data.members?.find(m => m.id === params?.memberId);
          setMember(found);
        }
      } catch (err) {
        console.error('Failed to fetch member:', err);
      }
      setLoading(false);
    };
    fetchData();
  }, [params?.memberId, user?.household_id]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-40" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!member) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">Member not found</p>
        <Link href="/citizen/dashboard">
          <Button variant="link">Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  const age = member.age || "N/A";
  const relation = member.relation || "N/A";
  const memberId = member.member_id || "N/A";
  const vaccinations = member.vaccinations || [];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/citizen/dashboard">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-serif font-bold">{member.name}</h1>
          <p className="text-muted-foreground">Family Member Profile</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Member Information Card */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Member ID</p>
                <p className="font-mono font-bold text-base" data-testid="text-member-id">{memberId}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground font-medium">Age</p>
                <p className="text-lg font-semibold" data-testid="text-member-age">{age} years</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground font-medium">Relationship</p>
                <Badge className="bg-blue-100 text-blue-800">{relation}</Badge>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground font-medium">Household</p>
                <p className="text-sm font-mono">{household?.household_id}</p>
                <p className="text-sm text-muted-foreground">{household?.family_name}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Vaccination Records */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Syringe className="h-5 w-5 text-emerald-600" />
                Vaccination Records
              </CardTitle>
            </CardHeader>
            <CardContent>
              {vaccinations.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Info className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No vaccination records yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {vaccinations.map((vac) => (
                    <div
                      key={vac.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition"
                      data-testid={`vaccination-record-${vac.id}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center">
                          <Syringe className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                          <p className="font-medium" data-testid={`vaccine-name-${vac.id}`}>{vac.vaccine_name}</p>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(vac.vaccination_date).toLocaleDateString('en-IN', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                        Completed
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Health Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            Health Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-muted-foreground font-medium mb-2">Vaccination Status</p>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center">
                  <span className="text-emerald-700 dark:text-emerald-300 font-bold">{vaccinations.length}</span>
                </div>
                <div>
                  <p className="font-semibold">{vaccinations.length} Vaccine{vaccinations.length !== 1 ? 's' : ''}</p>
                  <p className="text-sm text-muted-foreground">Administered</p>
                </div>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground font-medium mb-2">Family Status</p>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
                  <span className="text-blue-700 dark:text-blue-300 font-bold">✓</span>
                </div>
                <div>
                  <p className="font-semibold">Active Member</p>
                  <p className="text-sm text-muted-foreground">Under monitoring</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
