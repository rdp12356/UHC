import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertCircle, CheckCircle, Users, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

export default function AshaManagement() {
  const [, navigate] = useLocation();
  const [ashaWorkers, setAshaWorkers] = useState([]);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [suspensionReason, setSuspensionReason] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAshaWorkers();
  }, []);

  const fetchAshaWorkers = async () => {
    try {
      const res = await fetch("/api/asha-workers");
      if (res.ok) {
        const data = await res.json();
        setAshaWorkers(data || mockAshaWorkers);
      }
    } catch (err) {
      console.error("Failed to fetch ASHA workers:", err);
      setAshaWorkers(mockAshaWorkers);
    }
  };

  const mockAshaWorkers = [
    { asha_id: "ASHA-12-001", name: "Priya Kumar", ward_id: "WARD-KL-ER-12", status: "active", phone: "+91-9876543210" },
    { asha_id: "ASHA-12-002", name: "Anjali Singh", ward_id: "WARD-KL-ER-12", status: "active", phone: "+91-9876543211" },
    { asha_id: "ASHA-12-003", name: "Meera Nair", ward_id: "WARD-KL-ER-12", status: "suspended", suspension_reason: "Irregular visits", phone: "+91-9876543212" }
  ];

  const handleSuspendWorker = async (ashaId) => {
    if (!suspensionReason.trim()) {
      alert("Please enter a suspension reason");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/asha/${ashaId}/suspend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: suspensionReason, suspended_by: "government_official" })
      });

      if (res.ok) {
        await fetchAshaWorkers();
        setSuspensionReason("");
        setSelectedWorker(null);
      }
    } catch (err) {
      console.error("Failed to suspend worker:", err);
    }
    setLoading(false);
  };

  const handleReactivateWorker = async (ashaId) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/asha/${ashaId}/reactivate`, { method: "POST" });
      if (res.ok) {
        await fetchAshaWorkers();
      }
    } catch (err) {
      console.error("Failed to reactivate worker:", err);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate("/portals")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">ASHA Worker Management</h1>
          <p className="text-muted-foreground">Monitor and manage ASHA workers across your ward</p>
        </div>
      </div>

      <div className="grid gap-6">
        {ashaWorkers.map((worker) => (
          <Card key={worker.asha_id} className={worker.status === "suspended" ? "opacity-75 border-red-200" : ""}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{worker.name}</h3>
                  <p className="text-sm text-muted-foreground">{worker.asha_id} • {worker.phone}</p>
                </div>
                <Badge className={worker.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                  {worker.status === "active" ? <CheckCircle className="h-3 w-3 mr-1" /> : <AlertCircle className="h-3 w-3 mr-1" />}
                  {worker.status.toUpperCase()}
                </Badge>
              </div>

              {worker.suspension_reason && (
                <p className="text-sm text-red-600 dark:text-red-400 mb-4 p-3 bg-red-50 dark:bg-red-950 rounded">
                  Suspension Reason: {worker.suspension_reason}
                </p>
              )}

              <div className="flex gap-2">
                {worker.status === "active" && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="destructive" size="sm" onClick={() => setSelectedWorker(worker.asha_id)} data-testid={`button-suspend-${worker.asha_id}`}>
                        Suspend Worker
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Suspend ASHA Worker</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="reason">Suspension Reason</Label>
                          <Textarea
                            id="reason"
                            placeholder="Describe the reason for suspension..."
                            value={suspensionReason}
                            onChange={(e) => setSuspensionReason(e.target.value)}
                            data-testid="textarea-reason"
                          />
                        </div>
                        <Button
                          onClick={() => handleSuspendWorker(worker.asha_id)}
                          className="w-full"
                          disabled={loading}
                          data-testid="button-confirm-suspend"
                        >
                          Confirm Suspension
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
                {worker.status === "suspended" && (
                  <Button
                    onClick={() => handleReactivateWorker(worker.asha_id)}
                    className="bg-green-600 hover:bg-green-700"
                    size="sm"
                    disabled={loading}
                    data-testid={`button-reactivate-${worker.asha_id}`}
                  >
                    Reactivate Worker
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
