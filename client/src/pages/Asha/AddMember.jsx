import { useEffect, useState } from "react";
import { useLocation, useRoute } from "wouter";
import { api } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { Link } from "wouter";

const RELATIONS = ["Father", "Mother", "Son", "Daughter", "Grandfather", "Grandmother", "Brother", "Sister", "Uncle", "Aunt", "Cousin", "Spouse"];

export default function AddMember() {
  const [, params] = useRoute("/asha/add-member/:id");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [household, setHousehold] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    relation: ""
  });

  useEffect(() => {
    if (params?.id) {
      api.getCitizenProfile(params.id).then(data => {
        if (data) {
          setHousehold(data);
        }
      });
    }
  }, [params?.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.age || !formData.relation) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill all fields"
      });
      return;
    }

    setLoading(true);
    try {
      await api.post("/api/members", {
        household_id: params.id,
        name: formData.name,
        age: parseInt(formData.age),
        relation: formData.relation
      });

      toast({
        title: "Success",
        description: "Family member added successfully"
      });

      setFormData({ name: "", age: "", relation: "" });
      setLocation("/asha/households");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed",
        description: "Could not add family member"
      });
    }
    setLoading(false);
  };

  if (!household) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/asha/households" className="text-blue-600 hover:text-blue-700 flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
        <h1 className="text-2xl font-serif font-bold">Add Family Member</h1>
      </div>

      <Card className="border border-slate-200">
        <CardHeader>
          <CardTitle className="text-lg">
            {household.family_name || "Household"} - {household.family_head}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="font-semibold">Member Name *</Label>
              <Input
                id="name"
                data-testid="input-member-name"
                placeholder="Enter full name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="age" className="font-semibold">Age *</Label>
              <Input
                id="age"
                data-testid="input-member-age"
                type="number"
                min="0"
                max="120"
                placeholder="Enter age"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="relation" className="font-semibold">Relation *</Label>
              <Select value={formData.relation} onValueChange={(value) => setFormData({ ...formData, relation: value })}>
                <SelectTrigger id="relation" data-testid="select-relation">
                  <SelectValue placeholder="Select relation" />
                </SelectTrigger>
                <SelectContent>
                  {RELATIONS.map(rel => (
                    <SelectItem key={rel} value={rel}>{rel}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              data-testid="button-save-member"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Add Member
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
