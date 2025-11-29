import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Users, MapPin, Phone, Loader2 } from "lucide-react";

export default function AdminPanel() {
  const { toast } = useToast();
  const [ashaWorkers, setAshaWorkers] = useState([]);
  const [wards, setWards] = useState([]);
  const [households, setHouseholds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentAsha, setCurrentAsha] = useState(null);
  const [formData, setFormData] = useState({ name: "", phone: "", ward_id: "" });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [ashData, wardData, hhData] = await Promise.all([
        api.getAshaWorkers(),
        api.getWards(),
        api.getAllHouseholds()
      ]);
      setAshaWorkers(ashData || []);
      setWards(wardData || []);
      setHouseholds(hhData || []);
    } catch (error) {
      console.error("Failed to load data:", error);
    }
    setLoading(false);
  };

  const openAddDialog = () => {
    setEditMode(false);
    setCurrentAsha(null);
    setFormData({ name: "", phone: "", ward_id: "" });
    setDialogOpen(true);
  };

  const openEditDialog = (asha) => {
    setEditMode(true);
    setCurrentAsha(asha);
    setFormData({ name: asha.name, phone: asha.phone, ward_id: asha.ward_id });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.phone || !formData.ward_id) {
      toast({ variant: "destructive", title: "Please fill all fields" });
      return;
    }

    try {
      if (editMode && currentAsha) {
        await api.updateAshaWorker(currentAsha.asha_id, formData);
        toast({ title: "ASHA Worker Updated", description: `${formData.name} has been updated successfully.` });
      } else {
        await api.createAshaWorker(formData);
        toast({ title: "ASHA Worker Added", description: `${formData.name} has been added successfully.` });
      }
      setDialogOpen(false);
      loadData();
    } catch (error) {
      toast({ variant: "destructive", title: "Operation Failed", description: "Could not save ASHA worker." });
    }
  };

  const handleDelete = async (asha) => {
    if (!confirm(`Are you sure you want to remove ${asha.name}?`)) return;
    
    try {
      await api.deleteAshaWorker(asha.asha_id);
      toast({ title: "ASHA Worker Removed", description: `${asha.name} has been removed.` });
      loadData();
    } catch (error) {
      toast({ variant: "destructive", title: "Delete Failed" });
    }
  };

  const getWardName = (wardId) => {
    const ward = wards.find(w => w.ward_id === wardId);
    return ward ? `Ward ${ward.ward_number} - ${ward.ward_name}` : wardId;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold">Admin Panel</h1>
          <p className="text-muted-foreground">Manage ASHA workers, wards, and households</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{ashaWorkers.length}</p>
                <p className="text-sm text-muted-foreground">ASHA Workers</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-100 rounded-lg">
                <MapPin className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{wards.length}</p>
                <p className="text-sm text-muted-foreground">Wards</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{households.length}</p>
                <p className="text-sm text-muted-foreground">Households</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>ASHA Workers Management</CardTitle>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openAddDialog} data-testid="button-add-asha">
                <Plus className="h-4 w-4 mr-2" />
                Add ASHA Worker
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editMode ? "Edit ASHA Worker" : "Add New ASHA Worker"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter full name"
                    data-testid="input-asha-name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="+91 XXXXX XXXXX"
                    data-testid="input-asha-phone"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ward">Assigned Ward</Label>
                  <Select value={formData.ward_id} onValueChange={(v) => setFormData({...formData, ward_id: v})}>
                    <SelectTrigger data-testid="select-asha-ward">
                      <SelectValue placeholder="Select ward" />
                    </SelectTrigger>
                    <SelectContent>
                      {wards.map((w) => (
                        <SelectItem key={w.ward_id} value={w.ward_id}>
                          Ward {w.ward_number} - {w.ward_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleSubmit} data-testid="button-save-asha">
                  {editMode ? "Update" : "Add"} ASHA Worker
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Ward</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ashaWorkers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    No ASHA workers registered
                  </TableCell>
                </TableRow>
              ) : (
                ashaWorkers.map((asha) => (
                  <TableRow key={asha.asha_id} data-testid={`row-asha-${asha.asha_id}`}>
                    <TableCell className="font-mono text-sm">{asha.asha_id}</TableCell>
                    <TableCell className="font-medium">{asha.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        {asha.phone}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{getWardName(asha.ward_id)}</Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => openEditDialog(asha)} data-testid={`button-edit-asha-${asha.asha_id}`}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700" onClick={() => handleDelete(asha)} data-testid={`button-delete-asha-${asha.asha_id}`}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
