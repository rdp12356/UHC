import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from "recharts";
import { MapPin, Home, Users, Syringe, Droplets, Search, TrendingUp } from "lucide-react";

export default function WardManagement() {
  const [wards, setWards] = useState([]);
  const [selectedWardId, setSelectedWardId] = useState("");
  const [wardStats, setWardStats] = useState(null);
  const [households, setHouseholds] = useState([]);
  const [members, setMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

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

      // Calculate ward statistics
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
          { month: 'Apr', vaccination: wardStats?.vaccinationRate || 75, cleanliness: avgCleanliness }
        ]
      });
    } catch (error) {
      console.error("Failed to load ward data:", error);
    }
  };

  const currentWard = wards.find(w => w.ward_id === selectedWardId);
  const filteredHouseholds = households.filter(h => 
    h.family_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.family_head.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <Skeleton className="h-96 w-full" />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold">Ward Management</h1>
        <p className="text-muted-foreground">Monitor health metrics and household data by ward</p>
      </div>

      {/* Ward Selection */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            Select Ward
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedWardId} onValueChange={setSelectedWardId}>
            <SelectTrigger className="w-full md:w-64" data-testid="select-ward">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {wards.map((w) => (
                <SelectItem key={w.ward_id} value={w.ward_id}>
                  Ward {w.ward_number} - {w.ward_name}
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
            <Card className="border-l-4 border-l-blue-500 shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Home className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold" data-testid="stat-households">{wardStats.totalHouseholds}</p>
                    <p className="text-sm text-muted-foreground">Households</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-emerald-500 shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <Users className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold" data-testid="stat-members">{wardStats.totalMembers}</p>
                    <p className="text-sm text-muted-foreground">Members</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500 shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Syringe className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold" data-testid="stat-vaccination">{wardStats.vaccinationRate}%</p>
                    <p className="text-sm text-muted-foreground">Vaccination Rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-orange-500 shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Droplets className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold" data-testid="stat-cleanliness">{wardStats.cleanlinesScore}/100</p>
                    <p className="text-sm text-muted-foreground">Avg. Cleanliness</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Trend Chart */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                Health Metrics Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={wardStats.trend || []}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip cursor={{ fill: 'transparent' }} />
                    <Legend />
                    <Line type="monotone" dataKey="vaccination" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="cleanliness" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Households List */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Home className="h-5 w-5 text-blue-600" />
              Households in {currentWard?.ward_name}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-lg">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by family name or head..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-0 focus-visible:ring-0"
              data-testid="input-search-households"
            />
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Household ID</TableHead>
                  <TableHead>Family Name</TableHead>
                  <TableHead>Family Head</TableHead>
                  <TableHead>Cleanliness</TableHead>
                  <TableHead>Vaccination %</TableHead>
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
                    <TableRow key={h.household_id} data-testid={`row-household-${h.household_id}`}>
                      <TableCell className="font-mono text-sm">{h.household_id}</TableCell>
                      <TableCell className="font-medium">{h.family_name}</TableCell>
                      <TableCell>{h.family_head}</TableCell>
                      <TableCell>
                        <Badge variant={h.cleanliness_score >= 80 ? "default" : "outline"}>
                          {h.cleanliness_score}/100
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={h.vaccination_completion >= 80 ? "default" : "outline"}>
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
