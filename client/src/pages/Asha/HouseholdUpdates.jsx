import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, MapPin, Users, Edit } from "lucide-react";
import { Link } from "wouter";

export default function HouseholdUpdates() {
  const { user } = useAuth();
  const [households, setHouseholds] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const wardId = user?.ward_id || "WARD-KL-ER-12";
    api.getHouseholdsByWard(wardId).then(data => setHouseholds(data || [])).catch(() => setHouseholds([]));
  }, [user?.ward_id]);

  const filtered = (households || []).filter(h => {
    if (!h) return false;
    const head = (h.family_head || h.head || "").toLowerCase();
    const addr = (h.address || "").toLowerCase();
    const searchLower = (search || "").toLowerCase();
    return head.includes(searchLower) || addr.includes(searchLower);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold">Assigned Households</h1>
          <p className="text-muted-foreground">Manage surveys and health updates for your ward.</p>
        </div>
        <Link href="/asha/submit">
          <Button>+ New Survey</Button>
        </Link>
      </div>

      <div className="flex items-center space-x-2 max-w-sm">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search by head of family or address..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Head of Family</TableHead>
                <TableHead>Members</TableHead>
                <TableHead>Sanitation</TableHead>
                <TableHead>Last Visit</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((h) => (
                <TableRow key={h.household_id || h.id}>
                  <TableCell>
                    <div className="font-medium">{h.family_head || h.head || "N/A"}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {h.address || "Not specified"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3 text-muted-foreground" />
                      {h.members || "-"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={h.cleanliness_score >= 80 ? 'default' : 'destructive'} className={h.cleanliness_score >= 80 ? 'bg-emerald-500' : ''}>
                      {h.cleanliness_score >= 80 ? 'Good' : 'Pending'}
                    </Badge>
                  </TableCell>
                  <TableCell>Today</TableCell>
                  <TableCell className="text-right">
                    <Link href={`/asha/edit/${h.household_id}`}>
                      <Button variant="ghost" size="sm" data-testid={`button-edit-${h.household_id}`}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
