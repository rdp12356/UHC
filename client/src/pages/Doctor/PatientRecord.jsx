import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { api } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Calendar, MapPin, FilePlus, History, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";

export default function PatientRecord() {
  const [location] = useLocation();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Parse query param manually since wouter hooks are simple
  const searchParams = new URLSearchParams(window.location.search);
  const patientId = searchParams.get("id");

  useEffect(() => {
    const fetchPatient = async () => {
      if (patientId) {
        // We can reuse the citizen profile mock
        // In a real app, we'd have a getPatientById
        // For now, let's hack it by searching all
        const citizens = await api.searchPatient(""); 
        const found = citizens.find(c => c.id === patientId);
        setPatient(found);
      }
      setLoading(false);
    };
    fetchPatient();
  }, [patientId]);

  if (loading) return <div className="p-8"><Skeleton className="h-64 w-full" /></div>;
  if (!patient) return <div className="p-8 text-center">Patient not found.</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/doctor/search">
          <Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button>
        </Link>
        <div>
          <h1 className="text-2xl font-serif font-bold">{patient.name}</h1>
          <p className="text-muted-foreground text-sm">UHC: {patient.uhc_id}</p>
        </div>
        <div className="ml-auto">
          <Link href={`/doctor/add-notes?id=${patient.id}`}>
            <Button className="gap-2">
              <FilePlus className="h-4 w-4" /> Add Note
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Patient Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Gender / Age</p>
                  <p className="font-medium">{patient.gender}, {new Date().getFullYear() - new Date(patient.dob).getFullYear()} years</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Date of Birth</p>
                  <p className="font-medium">{patient.dob}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="font-medium">{patient.address}</p>
                </div>
              </div>
              <div className="pt-4 border-t">
                <div className="grid grid-cols-2 gap-4">
                   <div>
                     <p className="text-sm text-muted-foreground">Blood Group</p>
                     <p className="font-bold text-lg">{patient.blood_group}</p>
                   </div>
                   <div>
                     <p className="text-sm text-muted-foreground">Category</p>
                     <Badge variant="secondary">{patient.income_category}</Badge>
                   </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Tabs defaultValue="history">
            <TabsList className="w-full justify-start h-12 bg-slate-100 dark:bg-slate-900 p-1">
              <TabsTrigger value="history" className="h-10 px-6">Medical History</TabsTrigger>
              <TabsTrigger value="reports" className="h-10 px-6">Lab Reports</TabsTrigger>
              <TabsTrigger value="vitals" className="h-10 px-6">Vitals</TabsTrigger>
            </TabsList>
            
            <TabsContent value="history" className="mt-6">
              <Card>
                <CardContent className="p-0">
                  {patient.timeline.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">No medical history recorded.</div>
                  ) : (
                    <div className="divide-y">
                      {patient.timeline.map((event, i) => (
                        <div key={i} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors flex gap-4">
                          <div className="mt-1">
                            <div className="bg-primary/10 p-2 rounded-full text-primary">
                              <History className="h-4 w-4" />
                            </div>
                          </div>
                          <div className="flex-grow">
                            <div className="flex justify-between">
                              <h4 className="font-bold">{event.title}</h4>
                              <span className="text-xs text-muted-foreground">{event.date}</span>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{event.details}</p>
                            <Badge variant="outline" className="mt-2 text-xs">{event.type}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reports">
              <div className="p-8 text-center text-muted-foreground border-2 border-dashed rounded-lg">
                No lab reports uploaded yet.
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
