import { useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Save } from "lucide-react";

export default function SubmitForm() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Survey Submitted",
      description: "Household data has been updated successfully.",
    });
    
    setLoading(false);
    setLocation("/asha/households");
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Household Survey Form</CardTitle>
          <p className="text-muted-foreground">Record vaccination status and sanitation checks.</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="head">Head of Family Name</Label>
                <Input id="head" placeholder="Enter name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="members">Number of Members</Label>
                <Input id="members" type="number" min="1" placeholder="e.g. 4" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Sanitation Status</Label>
              <RadioGroup defaultValue="good" className="flex gap-4">
                <div className="flex items-center space-x-2 border p-3 rounded-lg flex-1 hover:bg-slate-50 cursor-pointer">
                  <RadioGroupItem value="good" id="good" />
                  <Label htmlFor="good" className="cursor-pointer">Good</Label>
                </div>
                <div className="flex items-center space-x-2 border p-3 rounded-lg flex-1 hover:bg-slate-50 cursor-pointer">
                  <RadioGroupItem value="pending" id="pending" />
                  <Label htmlFor="pending" className="cursor-pointer">Needs Attention</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>Vaccination Check</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Members Vaccinated</SelectItem>
                  <SelectItem value="partial">Partial / Pending</SelectItem>
                  <SelectItem value="refused">Refused</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes / Observations</Label>
              <Textarea id="notes" placeholder="Any health issues noticed..." />
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button type="button" variant="outline" onClick={() => window.history.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Submit Report
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
