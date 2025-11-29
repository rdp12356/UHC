import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from "recharts";
import { MapPin, Home, Users, Syringe, Droplets, Search, TrendingUp, Plus, Building2, Loader2 } from "lucide-react";

const INDIAN_STATES = [
  { code: 'KL', name: 'Kerala' },
  { code: 'MH', name: 'Maharashtra' },
  { code: 'TN', name: 'Tamil Nadu' },
  { code: 'GJ', name: 'Gujarat' },
  { code: 'UP', name: 'Uttar Pradesh' },
  { code: 'DL', name: 'Delhi' },
  { code: 'WB', name: 'West Bengal' },
  { code: 'KA', name: 'Karnataka' },
  { code: 'AP', name: 'Andhra Pradesh' },
  { code: 'TG', name: 'Telangana' },
];

const DISTRICT_MAP = {
  'KL': [
    { code: 'ER', name: 'Ernakulam' },
    { code: 'ID', name: 'Idukki' },
    { code: 'KZ', name: 'Kottayam' },
    { code: 'AL', name: 'Alappuzha' },
    { code: 'PA', name: 'Pathanamthitta' },
    { code: 'KN', name: 'Kannur' },
  ],
  'MH': [
    { code: 'MM', name: 'Mumbai' },
    { code: 'PU', name: 'Pune' },
    { code: 'NS', name: 'Nagpur' },
    { code: 'AU', name: 'Aurangabad' },
  ],
  'TN': [
    { code: 'CH', name: 'Chennai' },
    { code: 'CM', name: 'Coimbatore' },
    { code: 'MD', name: 'Madurai' },
    { code: 'SK', name: 'Salem' },
  ],
};

export default function WardManagement() {
  const { toast } = useToast();
  const [wards, setWards] = useState([]);
  const [selectedWardId, setSelectedWardId] = useState("");
  const [wardStats, setWardStats] = useState(null);
  const [households, setHouseholds] = useState([]);
  const [members, setMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWardNum, setSelectedWardNum] = useState("");
  const [wardName, setWardName] = useState("");
  const [creatingWard, setCreatingWard] = useState(false);

  useEffect(() => {
    loadWards();
  }, []);

  useEffect(() => {
    if (selectedWardId) {
      loadWardData(selectedWardId);
    }
  }, [selectedWardId]);

  const loadWards = async () => {
    try {
      const wardsData = await api.getWards();
      if (wardsData && wardsData.length > 0) {
        setWards(wardsData);
        setSelectedWardId(wardsData[0].ward_id);
      }
      setLoading(false);
    } catch (error) {
      console.error("Failed to load wards:", error);
      setLoading(false);
    }
  };

  const loadWardData = async (wardId) => {
    try {
      const [householdsData, membersData] = await Promise.all([
        api.getHouseholdsByWard(wardId),
        api.getMembersByWard(wardId)
      ]);

      setHouseholds(householdsData || []);
      const allMembers = membersData || [];
      setMembers(allMembers);

      const vaccinated = allMembers.filter(m => (m.vaccinations || []).length > 0).length;
      const avgCleanliness = householdsData ? 
        Math.round(householdsData.reduce((sum, h) => sum + (h.cleanliness_score || 0), 0) / householdsData.length) : 0;

      setWardStats({
        totalHouseholds: householdsData?.length || 0,
        totalMembers: allMembers.length,
        vaccinationRate: allMembers.length > 0 ? Math.round((vaccinated / allMembers.length) * 100) : 0,
        cleanlinesScore: avgCleanliness,
        trend: [
          { month: 'Jan', vaccination: 60, cleanliness: 70 },
          { month: 'Feb', vaccination: 65, cleanliness: 72 },
          { month: 'Mar', vaccination: 70, cleanliness: 75 },
          { month: 'Apr', vaccination: allMembers.length > 0 ? Math.round((vaccinated / allMembers.length) * 100) : 75, cleanliness: avgCleanliness }
        ]
      });
    } catch (error) {
      console.error("Failed to load ward data:", error);
    }
  };

  const handleCreateWard = async () => {
    if (!selectedState || !selectedDistrict || !selectedWardNum || !wardName) {
      toast({ variant: "destructive", title: "Please fill all fields" });
      return;
    }

    setCreatingWard(true);
    try {
      const wardId = `WARD-${selectedState}-${selectedDistrict}-${selectedWardNum}`;
      const districtInfo = DISTRICT_MAP[selectedState]?.find(d => d.code === selectedDistrict);
      const stateName = INDIAN_STATES.find(s => s.code === selectedState)?.name;

      await api.createWard({
        ward_id: wardId,
        state: stateName,
        district: districtInfo?.name,
        ward_name: wardName,
        ward_number: parseInt(selectedWardNum),
        cleanliness_rate: 75,
        vaccination_completion_rate: 70,
      });

      toast({ title: "Ward Created", description: `${wardName} has been created successfully.` });
      setDialogOpen(false);
      setSelectedState("");
      setSelectedDistrict("");
      setSelectedWardNum("");
      setWardName("");
      loadWards();
    } catch (error) {
      console.error("Failed to create ward:", error);
      toast({ variant: "destructive", title: "Error", description: "Failed to create ward" });
    } finally {
      setCreatingWard(false);
    }
  };

  const currentWard = wards.find(w => w.ward_id === selectedWardId);
  const filteredHouseholds = households.filter(h => 
    h.family_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.family_head.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const availableDistricts = DISTRICT_MAP[selectedState] || [];

  if (loading) return <Skeleton className="h-96 w-full" />;

  return (
    <div className="space-y-6">
      {/* Government Portal Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl p-8 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
              <Building2 className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold font-serif">Ward Management System</h1>
              <p className="text-slate-300 mt-1">National Health Platform - Government Portal</p>
            </div>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg" data-testid="button-add-ward">
                <Plus className="h-4 w-4 mr-2" />
                Add New Ward
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-2xl">
                  <MapPin className="h-6 w-6" />
                  Create New Ward
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-6 py-6">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-4">Select Location Hierarchy</p>
                  <div className="grid grid-cols-3 gap-4">
                    {/* State Selection */}
                    <div className="space-y-2">
                      <Label htmlFor="state" className="text-sm font-semibold">State</Label>
                      <Select value={selectedState} onValueChange={setSelectedState}>
                        <SelectTrigger id="state" data-testid="select-state">
                          <SelectValue placeholder="Choose state" />
                        </SelectTrigger>
                        <SelectContent>
                          {INDIAN_STATES.map((s) => (
                            <SelectItem key={s.code} value={s.code}>
                              {s.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* District Selection */}
                    <div className="space-y-2">
                      <Label htmlFor="district" className="text-sm font-semibold">District</Label>
                      <Select 
                        value={selectedDistrict} 
                        onValueChange={setSelectedDistrict}
                        disabled={!selectedState}
                      >
                        <SelectTrigger id="district" data-testid="select-district">
                          <SelectValue placeholder={selectedState ? "Choose district" : "Select state first"} />
                        </SelectTrigger>
                        <SelectContent>
                          {availableDistricts.map((d) => (
                            <SelectItem key={d.code} value={d.code}>
                              {d.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Ward Number */}
                    <div className="space-y-2">
                      <Label htmlFor="wardNum" className="text-sm font-semibold">Ward #</Label>
                      <Input
                        id="wardNum"
                        type="number"
                        placeholder="e.g., 12"
                        value={selectedWardNum}
                        onChange={(e) => setSelectedWardNum(e.target.value)}
                        min="1"
                        max="999"
                        data-testid="input-ward-number"
                      />
                    </div>
                  </div>
                </div>

                {/* Ward Name */}
                <div className="space-y-2">
                  <Label htmlFor="wardName" className="text-sm font-semibold">Ward Name</Label>
                  <Input
                    id="wardName"
                    placeholder="e.g., Ernakulam North"
                    value={wardName}
                    onChange={(e) => setWardName(e.target.value)}
                    data-testid="input-ward-name"
                  />
                </div>

                {/* Generated Ward ID */}
                {selectedState && selectedDistrict && selectedWardNum && (
                  <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <p className="text-sm text-slate-600 dark:text-slate-400">Generated Ward ID</p>
                    <p className="font-mono text-lg font-bold text-blue-700 dark:text-blue-400">
                      WARD-{selectedState}-{selectedDistrict}-{selectedWardNum}
                    </p>
                  </div>
                )}
              </div>

              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button 
                  onClick={handleCreateWard} 
                  disabled={creatingWard}
                  className="bg-emerald-600 hover:bg-emerald-700"
                  data-testid="button-create-ward"
                >
                  {creatingWard ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Ward
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Ward Selection */}
      <Card className="shadow-sm border-t-4 border-t-blue-600">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            Select Ward for Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedWardId} onValueChange={setSelectedWardId}>
            <SelectTrigger className="w-full md:w-96" data-testid="select-ward">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {wards.map((w) => (
                <SelectItem key={w.ward_id} value={w.ward_id}>
                  Ward {w.ward_number} - {w.ward_name} ({w.district})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Ward Statistics */}
      {wardStats && (
        <>
          <div className="grid md:grid-cols-4 gap-4">
            <Card className="border-l-4 border-l-blue-500 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Home className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold" data-testid="stat-households">{wardStats.totalHouseholds}</p>
                    <p className="text-sm text-muted-foreground font-medium">Total Households</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-emerald-500 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                    <Users className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold" data-testid="stat-members">{wardStats.totalMembers}</p>
                    <p className="text-sm text-muted-foreground font-medium">Family Members</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <Syringe className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-purple-600" data-testid="stat-vaccination">{wardStats.vaccinationRate}%</p>
                    <p className="text-sm text-muted-foreground font-medium">Vaccination Rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-orange-500 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                    <Droplets className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-orange-600" data-testid="stat-cleanliness">{wardStats.cleanlinesScore}</p>
                    <p className="text-sm text-muted-foreground font-medium">Avg. Cleanliness/100</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Trend Chart */}
          <Card className="shadow-md">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2 text-xl">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                Health Metrics Trend (Past 4 Months)
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={wardStats.trend || []}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip 
                      cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
                      contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="vaccination" stroke="#10b981" strokeWidth={3} dot={{ r: 5, fill: '#10b981' }} name="Vaccination %" />
                    <Line type="monotone" dataKey="cleanliness" stroke="#3b82f6" strokeWidth={3} dot={{ r: 5, fill: '#3b82f6' }} name="Cleanliness Score" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Households List */}
      <Card className="shadow-md">
        <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950/20">
          <CardTitle className="flex items-center justify-between text-xl">
            <span className="flex items-center gap-2">
              <Home className="h-5 w-5 text-blue-600" />
              Households in {currentWard?.ward_name}
            </span>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              {filteredHouseholds.length} records
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by family name or head..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-0 focus-visible:ring-0"
              data-testid="input-search-households"
            />
          </div>

          <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
            <Table>
              <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="font-semibold">Household ID</TableHead>
                  <TableHead className="font-semibold">Family Name</TableHead>
                  <TableHead className="font-semibold">Family Head</TableHead>
                  <TableHead className="font-semibold text-center">Cleanliness</TableHead>
                  <TableHead className="font-semibold text-center">Vaccination %</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHouseholds.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      {searchQuery ? "No households match your search" : "No households in this ward"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredHouseholds.map((h) => (
                    <TableRow key={h.household_id} data-testid={`row-household-${h.household_id}`} className="hover:bg-slate-50 dark:hover:bg-slate-900/30">
                      <TableCell className="font-mono text-sm font-medium">{h.household_id}</TableCell>
                      <TableCell className="font-medium">{h.family_name}</TableCell>
                      <TableCell>{h.family_head}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant={h.cleanliness_score >= 80 ? "default" : "outline"} className={h.cleanliness_score >= 80 ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200" : ""}>
                          {h.cleanliness_score}/100
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={h.vaccination_completion >= 80 ? "default" : "outline"} className={h.vaccination_completion >= 80 ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" : ""}>
                          {h.vaccination_completion || 0}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
