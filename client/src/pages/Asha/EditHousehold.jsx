import { useEffect, useState } from "react";
import { useLocation, useRoute } from "wouter";
import { api } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Loader2, UserPlus, Trash2 } from "lucide-react";
import { Link } from "wouter";

export default function EditHousehold() {
  const [, params] = useRoute("/asha/edit/:id");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [household, setHousehold] = useState(null);
  const [formData, setFormData] = useState({
    family_head: "",
    family_name: "",
    address: "",
    cleanliness_score: 80,
    vaccination_completion: 100,
    last_visit: new Date().toISOString().split('T')[0]
  });
  const [members, setMembers] = useState([]);

  useEffect(() => {
    if (params?.id) {
      api.getCitizenProfile(params.id).then(data => {
        if (data) {
          setHousehold(data);
          setFormData({
            family_head: data.family_head || "",
            family_name: data.family_name || "",
            address: data.address || "",
            cleanliness_score: data.cleanliness_score || 80,
            vaccination_completion: data.vaccination_completion || 100,
            last_visit: data.last_visit || new Date().toISOString().split('T')[0]
          });
          setMembers(data.members || []);
        }
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, [params?.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      await api.updateHousehold(params.id, {
        ...formData,
        cleanliness_score: parseInt(formData.cleanliness_score),
        vaccination_completion: parseInt(formData.vaccination_completion)
      });
      
      toast({
        title: "Household Updated",
        description: "Family details have been saved successfully.",
      });
      
      setLocation("/asha/households");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Could not save changes. Please try again.",
      });
    }
    
    setSaving(false);
  };

  const updateMemberVaccination = async (memberId, vaccine) => {
    try {
      await api.addVaccination(memberId, vaccine, new Date().toISOString().split('T')[0]);
      toast({ title: "Vaccination Added", description: `${vaccine} recorded successfully.` });
      const updated = await api.getCitizenProfile(params.id);
      if (updated) setMembers(updated.members || []);
    } catch (error) {
      toast({ variant: "destructive", title: "Failed to add vaccination" });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!household) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Household not found</p>
        <Link href="/asha/households">
          <Button variant="link">Back to Households</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/asha/households">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-serif font-bold">Edit Household</h1>
          <p className="text-muted-foreground">Update family details, vaccination, and sanitation status</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Family Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="family_head">Head of Family</Label>
                <Input 
                  id="family_head"
                  value={formData.family_head}
                  onChange={(e) => setFormData({...formData, family_head: e.target.value})}
                  data-testid="input-family-head"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="family_name">Family Name</Label>
                <Input 
                  id="family_name"
                  value={formData.family_name}
                  onChange={(e) => setFormData({...formData, family_name: e.target.value})}
                  data-testid="input-family-name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input 
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                placeholder="Enter full address"
                data-testid="input-address"
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cleanliness">Cleanliness Score (0-100)</Label>
                <Input 
                  id="cleanliness"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.cleanliness_score}
                  onChange={(e) => setFormData({...formData, cleanliness_score: e.target.value})}
                  data-testid="input-cleanliness"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vaccination">Vaccination Completion (%)</Label>
                <Input 
                  id="vaccination"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.vaccination_completion}
                  onChange={(e) => setFormData({...formData, vaccination_completion: e.target.value})}
                  data-testid="input-vaccination"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_visit">Last Visit Date</Label>
                <Input 
                  id="last_visit"
                  type="date"
                  value={formData.last_visit}
                  onChange={(e) => setFormData({...formData, last_visit: e.target.value})}
                  data-testid="input-last-visit"
                />
              </div>
            </div>

            <Button type="submit" disabled={saving} className="w-full" data-testid="button-save-household">
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Household Details
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </form>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Family Members ({members.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {members.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No members registered</p>
          ) : (
            <div className="space-y-4">
              {members.map((member) => (
                <div key={member.id} className="border rounded-lg p-4 space-y-3" data-testid={`member-card-${member.id}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{member.name}</h4>
                      <p className="text-sm text-muted-foreground">Age: {member.age} | {member.relation}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium mb-2">Vaccinations:</p>
                    <div className="flex flex-wrap gap-2">
                      {member.vaccinations?.map((v) => (
                        <span key={v.id} className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs">
                          {v.vaccine_name} ({v.vaccination_date})
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 mt-2">
                    <Select onValueChange={(vaccine) => updateMemberVaccination(member.id, vaccine)}>
                      <SelectTrigger className="w-48" data-testid={`select-vaccine-${member.id}`}>
                        <SelectValue placeholder="Add vaccination" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="COVID Booster">COVID Booster</SelectItem>
                        <SelectItem value="Flu 2025">Flu 2025</SelectItem>
                        <SelectItem value="Tetanus">Tetanus</SelectItem>
                        <SelectItem value="Hepatitis B">Hepatitis B</SelectItem>
                        <SelectItem value="Polio Booster">Polio Booster</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
