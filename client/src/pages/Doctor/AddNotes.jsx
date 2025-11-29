import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { api } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, CheckCircle } from "lucide-react";

export default function AddNotes() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [patientName, setPatientName] = useState("");
  
  const searchParams = new URLSearchParams(window.location.search);
  const patientId = searchParams.get("id");

  const [formData, setFormData] = useState({
    diagnosis: "",
    details: "",
    type: "Visit"
  });

  useEffect(() => {
    if (!patientId) {
      setLocation("/doctor/search");
      return;
    }
    // Fetch basic info just to show name
    api.searchPatient("").then(citizens => {
      const p = citizens.find(c => c.id === patientId);
      if (p) setPatientName(p.name);
    });
  }, [patientId, setLocation]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    await api.addPatientNote(patientId, formData);
    
    toast({
      title: "Record Updated",
      description: "Patient diagnosis has been saved successfully.",
    });
    
    setLoading(false);
    setLocation(`/doctor/record?id=${patientId}`);
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Add Clinical Note</CardTitle>
          <p className="text-muted-foreground">Adding record for <span className="font-bold text-foreground">{patientName}</span></p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label>Record Type</Label>
              <Select 
                defaultValue="Visit" 
                onValueChange={(val) => setFormData({...formData, type: val})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Visit">General Visit</SelectItem>
                  <SelectItem value="Vaccination">Vaccination</SelectItem>
                  <SelectItem value="Lab">Lab Report</SelectItem>
                  <SelectItem value="Emergency">Emergency</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="diagnosis">Title / Diagnosis</Label>
              <Input 
                id="diagnosis" 
                placeholder="e.g. Viral Fever, Type 2 Diabetes Checkup" 
                required
                value={formData.diagnosis}
                onChange={(e) => setFormData({...formData, diagnosis: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="details">Clinical Details / Prescription</Label>
              <Textarea 
                id="details" 
                placeholder="Enter symptoms, observations, and prescribed medication..." 
                className="min-h-[150px]"
                required
                value={formData.details}
                onChange={(e) => setFormData({...formData, details: e.target.value})}
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => window.history.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                Save Record
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
