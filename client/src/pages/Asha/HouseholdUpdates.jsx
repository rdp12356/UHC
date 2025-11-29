import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, MapPin, Users, Edit } from "lucide-react";
import { Link } from "wouter";

export default function HouseholdUpdates() {
  const [households, setHouseholds] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.getHouseholds().then(setHouseholds);
  }, []);

  const filtered = households.filter(h => 
    h.head.toLowerCase().includes(search.toLowerCase()) || 
    h.address.toLowerCase().includes(search.toLowerCase())
  );

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
                <TableRow key={h.id}>
                  <TableCell>
                    <div className="font-medium">{h.head}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {h.address}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3 text-muted-foreground" />
                      {h.members}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={h.sanitation_status === 'Good' ? 'default' : 'destructive'} className={h.sanitation_status === 'Good' ? 'bg-emerald-500' : ''}>
                      {h.sanitation_status}
                    </Badge>
                  </TableCell>
                  <TableCell>{h.last_visit}</TableCell>
                  <TableCell className="text-right">
                    <Link href={`/asha/submit?id=${h.id}`}>
                      <Button variant="ghost" size="sm">
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
