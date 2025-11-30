import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, User, Plus, CheckCircle, XCircle, AlertCircle, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    patient_id: "",
    appointment_date: "",
    appointment_time: "",
    reason: "",
    notes: ""
  });

  useEffect(() => {
    if (user?.id) {
      fetchAppointments();
    }
  }, [user?.id]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/appointments/doctor/${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setAppointments(data.length > 0 ? data : mockAppointments);
      } else {
        // Use mock data if API fails
        setAppointments(mockAppointments);
      }
    } catch (err) {
      console.error("Failed to fetch appointments:", err);
      setAppointments(mockAppointments);
    }
    setLoading(false);
  };

  const mockAppointments = [
    {
      id: "1",
      doctor_id: user?.id,
      patient_id: "UHC-2025-0001",
      appointment_date: "2025-12-05",
      appointment_time: "10:00 AM",
      reason: "Regular checkup",
      notes: "Blood pressure monitoring",
      status: "scheduled"
    },
    {
      id: "2",
      doctor_id: user?.id,
      patient_id: "UHC-2025-0002",
      appointment_date: "2025-12-06",
      appointment_time: "02:00 PM",
      reason: "Follow-up consultation",
      notes: "Diabetes management review",
      status: "scheduled"
    }
  ];

  const handleCreateAppointment = async () => {
    if (!newAppointment.patient_id || !newAppointment.appointment_date || !newAppointment.appointment_time) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newAppointment,
          doctor_id: user.id,
          status: "scheduled"
        })
      });
      if (res.ok) {
        await fetchAppointments();
        setNewAppointment({
          patient_id: "",
          appointment_date: "",
          appointment_time: "",
          reason: "",
          notes: ""
        });
      }
    } catch (err) {
      console.error("Failed to create appointment:", err);
    }
  };

  const handleUpdateStatus = async (appointmentId, status) => {
    try {
      const res = await fetch(`/api/appointments/${appointmentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        await fetchAppointments();
      }
    } catch (err) {
      console.error("Failed to update appointment:", err);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "scheduled": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "completed": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "cancelled": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default: return "bg-slate-100 text-slate-800";
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case "completed": return <CheckCircle className="h-4 w-4" />;
      case "cancelled": return <XCircle className="h-4 w-4" />;
      case "scheduled": return <AlertCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  const upcomingAppointments = appointments.filter(a => a.status === "scheduled");
  const completedAppointments = appointments.filter(a => a.status === "completed");
  const cancelledAppointments = appointments.filter(a => a.status === "cancelled");

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/doctor/search")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-white">Doctor Dashboard</h1>
            <p className="text-muted-foreground">Manage your appointments and patient schedules</p>
          </div>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> New Appointment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Schedule New Appointment</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="patient-id">Patient ID / UHC ID</Label>
                <Input
                  id="patient-id"
                  placeholder="e.g., UHC-2025-0001"
                  value={newAppointment.patient_id}
                  onChange={(e) => setNewAppointment({...newAppointment, patient_id: e.target.value})}
                  data-testid="input-patient-id"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="appointment-date">Appointment Date</Label>
                <Input
                  id="appointment-date"
                  type="date"
                  value={newAppointment.appointment_date}
                  onChange={(e) => setNewAppointment({...newAppointment, appointment_date: e.target.value})}
                  data-testid="input-date"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="appointment-time">Time</Label>
                <Input
                  id="appointment-time"
                  type="time"
                  value={newAppointment.appointment_time}
                  onChange={(e) => setNewAppointment({...newAppointment, appointment_time: e.target.value})}
                  data-testid="input-time"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reason">Reason for Visit</Label>
                <Input
                  id="reason"
                  placeholder="e.g., Regular checkup"
                  value={newAppointment.reason}
                  onChange={(e) => setNewAppointment({...newAppointment, reason: e.target.value})}
                  data-testid="input-reason"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Any special instructions..."
                  value={newAppointment.notes}
                  onChange={(e) => setNewAppointment({...newAppointment, notes: e.target.value})}
                  data-testid="textarea-notes"
                />
              </div>
              <Button onClick={handleCreateAppointment} className="w-full" data-testid="button-create">
                Create Appointment
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{upcomingAppointments.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Scheduled appointments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{completedAppointments.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Finished appointments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{new Set(appointments.map(a => a.patient_id)).size}</div>
            <p className="text-xs text-muted-foreground mt-1">Unique patients</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-4">
        <TabsList className="w-full justify-start h-10 bg-slate-100 dark:bg-slate-900 p-1">
          <TabsTrigger value="upcoming" className="h-8">Upcoming ({upcomingAppointments.length})</TabsTrigger>
          <TabsTrigger value="completed" className="h-8">Completed ({completedAppointments.length})</TabsTrigger>
          <TabsTrigger value="cancelled" className="h-8">Cancelled ({cancelledAppointments.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingAppointments.length === 0 ? (
            <Card className="p-8 text-center text-muted-foreground">No upcoming appointments</Card>
          ) : (
            upcomingAppointments.map((apt) => (
              <Card key={apt.id} className="hover:shadow-lg transition-all">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-grow">
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(apt.status)}>
                          {getStatusIcon(apt.status)} <span className="ml-1">{apt.status}</span>
                        </Badge>
                      </div>
                      <h3 className="font-bold text-lg">{apt.patient_id}</h3>
                      {apt.reason && <p className="text-sm text-muted-foreground">{apt.reason}</p>}
                    </div>
                    <div className="text-right space-y-2">
                      <div className="flex items-center gap-1 text-sm font-medium">
                        <Calendar className="h-4 w-4" /> {apt.appointment_date}
                      </div>
                      <div className="flex items-center gap-1 text-sm font-medium">
                        <Clock className="h-4 w-4" /> {apt.appointment_time}
                      </div>
                    </div>
                  </div>
                  {apt.notes && <p className="text-sm bg-slate-50 dark:bg-slate-900 p-2 rounded">{apt.notes}</p>}
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" onClick={() => handleUpdateStatus(apt.id, "completed")} className="flex-1" data-testid={`button-complete-${apt.id}`}>
                      Mark Complete
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleUpdateStatus(apt.id, "cancelled")} data-testid={`button-cancel-${apt.id}`}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedAppointments.length === 0 ? (
            <Card className="p-8 text-center text-muted-foreground">No completed appointments</Card>
          ) : (
            completedAppointments.map((apt) => (
              <Card key={apt.id} className="opacity-75">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getStatusColor(apt.status)}>
                          {getStatusIcon(apt.status)} <span className="ml-1">{apt.status}</span>
                        </Badge>
                      </div>
                      <h3 className="font-bold">{apt.patient_id}</h3>
                      {apt.reason && <p className="text-sm text-muted-foreground">{apt.reason}</p>}
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      <div>{apt.appointment_date}</div>
                      <div>{apt.appointment_time}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="cancelled" className="space-y-4">
          {cancelledAppointments.length === 0 ? (
            <Card className="p-8 text-center text-muted-foreground">No cancelled appointments</Card>
          ) : (
            cancelledAppointments.map((apt) => (
              <Card key={apt.id} className="opacity-50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getStatusColor(apt.status)}>
                          {getStatusIcon(apt.status)} <span className="ml-1">{apt.status}</span>
                        </Badge>
                      </div>
                      <h3 className="font-bold line-through">{apt.patient_id}</h3>
                      {apt.reason && <p className="text-sm text-muted-foreground">{apt.reason}</p>}
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      <div>{apt.appointment_date}</div>
                      <div>{apt.appointment_time}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
