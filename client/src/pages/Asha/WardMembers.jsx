import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Users } from "lucide-react";

export default function WardMembers() {
  const { user } = useAuth();
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const wardId = user?.ward_id || "WARD-KL-ER-12";
    api.getMembersByWard(wardId).then(data => setMembers(data || [])).catch(() => setMembers([]));
  }, [user?.ward_id]);

  const filtered = (members || []).filter(m => {
    if (!m) return false;
    const name = (m.name || "").toLowerCase();
    const searchLower = (search || "").toLowerCase();
    return name.includes(searchLower);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold">Ward Members</h1>
          <p className="text-muted-foreground">View all members in your ward and their health status.</p>
        </div>
      </div>

      <div className="flex items-center space-x-2 max-w-sm">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search by member name..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          data-testid="input-search-member"
        />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Relation</TableHead>
                <TableHead>Household</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan="5" className="text-center text-muted-foreground py-8">
                    No members found
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((m) => (
                  <TableRow key={m.id} data-testid={`row-member-${m.id}`}>
                    <TableCell className="font-mono text-xs" data-testid={`text-member-id-${m.id}`}>{m.member_id || "-"}</TableCell>
                    <TableCell className="font-medium" data-testid={`text-name-${m.id}`}>{m.name || "N/A"}</TableCell>
                    <TableCell>{m.age || "-"}</TableCell>
                    <TableCell>{m.relation || "-"}</TableCell>
                    <TableCell>{m.household_id || "-"}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                        Active
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="text-sm text-muted-foreground">
        Total: <strong>{filtered.length}</strong> members found
      </div>
    </div>
  );
}
