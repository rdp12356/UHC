import { useState } from "react";
import { api } from "@/services/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, User, ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function DoctorSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const data = await api.searchPatient(query);
      setResults(data || []);
    } catch (err) {
      console.error('Search failed:', err);
      setResults([]);
    }
    setSearched(true);
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-white">Find Patient Record</h1>
        <p className="text-muted-foreground">Enter Unique Health Code (UHC) or Patient Name</p>
      </div>

      <Card className="shadow-lg border-primary/20">
        <CardContent className="p-6">
          <form onSubmit={handleSearch} className="flex gap-3">
            <Input 
              placeholder="e.g. UHC-2025-8891 or 'Rahul'" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-12 text-lg"
              autoFocus
            />
            <Button type="submit" className="h-12 px-6" disabled={loading}>
              {loading ? "Searching..." : <><Search className="mr-2 h-5 w-5" /> Search</>}
            </Button>
          </form>
        </CardContent>
      </Card>

      {searched && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="font-medium text-muted-foreground">Search Results ({results.length})</h3>
          
          {results.length === 0 ? (
            <div className="text-center p-8 border rounded-lg bg-slate-50 text-muted-foreground">
              No patients found matching "{query}"
            </div>
          ) : (
            <div className="grid gap-4">
              {results.map((patient) => (
                <Link key={patient.id} href={`/doctor/record?id=${patient.id}`}>
                  <Card className="cursor-pointer hover:border-primary transition-colors group">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6" />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg group-hover:text-primary transition-colors">{patient.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {patient.uhc_id} • {patient.gender}, {new Date().getFullYear() - new Date(patient.dob).getFullYear()}y
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
