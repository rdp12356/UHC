import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Save, Home, UserPlus, Check } from "lucide-react";

export default function SubmitForm() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [createdUHC, setCreatedUHC] = useState(null);
  
  const [formData, setFormData] = useState({
    family_head: "",
    family_name: "",
    address: "",
    members_count: 1,
    sanitation: "good",
    vaccination: "all",
    notes: ""
  });

  const generateUHCId = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(1000 + Math.random() * 9000);
    return `UHC-${year}-${random}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const wardId = user?.ward_id || "WARD-KL-ER-12";
      const uhcId = generateUHCId();
      const householdId = `HH-${wardId.split('-').pop()}-${Date.now().toString().slice(-4)}`;
      
      const household = await api.createHousehold({
        household_id: householdId,
        ward_id: wardId,
        family_name: formData.family_name || `${formData.family_head} Family`,
        family_head: formData.family_head,
        address: formData.address,
        cleanliness_score: formData.sanitation === 'good' ? 85 : 60,
        vaccination_completion: formData.vaccination === 'all' ? 100 : formData.vaccination === 'partial' ? 50 : 0,
        uhc_id: uhcId,
        last_visit: new Date().toISOString().split('T')[0]
      });
      
      setCreatedUHC(uhcId);
      
      toast({
        title: "Household Registered",
        description: `New UHC ID created: ${uhcId}`,
      });
    } catch (error) {
      console.error("Error creating household:", error);
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: "Could not register household. Please try again.",
      });
    }
    
    setLoading(false);
  };

  if (createdUHC) {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <Card className="border-2 border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20">
          <CardContent className="pt-8 text-center space-y-6">
            <div className="inline-flex items-center justify-center p-4 bg-emerald-100 rounded-full">
              <Check className="h-10 w-10 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-emerald-800 dark:text-emerald-400">Household Registered Successfully!</h2>
              <p className="text-muted-foreground mt-2">The family has been added to the UHC system</p>
            </div>
            <div className="p-6 bg-white dark:bg-slate-900 rounded-xl border-2 border-dashed border-emerald-300">
              <p className="text-sm text-muted-foreground mb-2">Unique Health Code</p>
              <p className="text-3xl font-mono font-bold text-primary" data-testid="text-created-uhc">{createdUHC}</p>
              <p className="text-sm text-muted-foreground mt-2">Please share this code with the family</p>
            </div>
            <div className="flex gap-4 justify-center pt-4">
              <Button variant="outline" onClick={() => { setCreatedUHC(null); setFormData({ family_head: "", family_name: "", address: "", members_count: 1, sanitation: "good", vaccination: "all", notes: "" }); }}>
                <UserPlus className="h-4 w-4 mr-2" />
                Register Another Family
              </Button>
              <Button onClick={() => setLocation("/asha/households")}>
                <Home className="h-4 w-4 mr-2" />
                Back to Households
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Register New Household
          </CardTitle>
          <CardDescription>Create a new UHC ID for a family in your ward. This ID is mandatory for all health services.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="head">Head of Family Name *</Label>
                <Input 
                  id="head" 
                  placeholder="Enter full name" 
                  value={formData.family_head}
                  onChange={(e) => setFormData({...formData, family_head: e.target.value})}
                  required 
                  data-testid="input-head-name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="family_name">Family Name</Label>
                <Input 
                  id="family_name" 
                  placeholder="e.g., Kumar Family"
                  value={formData.family_name}
                  onChange={(e) => setFormData({...formData, family_name: e.target.value})}
                  data-testid="input-family-name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address *</Label>
              <Input 
                id="address" 
                placeholder="Full address"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                required
                data-testid="input-address"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="members">Number of Family Members</Label>
              <Input 
                id="members" 
                type="number" 
                min="1" 
                placeholder="e.g., 4"
                value={formData.members_count}
                onChange={(e) => setFormData({...formData, members_count: parseInt(e.target.value) || 1})}
                data-testid="input-members-count"
              />
            </div>

            <div className="space-y-2">
              <Label>Sanitation Status</Label>
              <RadioGroup 
                value={formData.sanitation} 
                onValueChange={(v) => setFormData({...formData, sanitation: v})}
                className="flex gap-4"
              >
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
              <Label>Vaccination Status</Label>
              <Select value={formData.vaccination} onValueChange={(v) => setFormData({...formData, vaccination: v})}>
                <SelectTrigger data-testid="select-vaccination">
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
              <Textarea 
                id="notes" 
                placeholder="Any health issues, special notes..."
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                data-testid="input-notes"
              />
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button type="button" variant="outline" onClick={() => setLocation("/asha/households")}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading} data-testid="button-submit">
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Register & Generate UHC ID
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
