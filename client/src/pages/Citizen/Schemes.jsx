import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/services/api";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, CheckCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function CitizenSchemes() {
  const { user } = useAuth();
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (user?.id) {
        const profile = await api.getCitizenProfile(user.id);
        if (profile) {
          const data = await api.getEligibleSchemes(profile.income_category);
          setSchemes(data);
        }
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  if (loading) {
    return <div className="grid md:grid-cols-2 gap-4">
      {[1,2].map(i => <Skeleton key={i} className="h-48 w-full" />)}
    </div>;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-serif font-bold">Eligible Schemes</h1>
        <p className="text-muted-foreground">Government health schemes you are eligible for based on your profile.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {schemes.map((scheme) => (
          <Card key={scheme.id} className="flex flex-col shadow-sm hover:shadow-lg transition-all border-t-4 border-t-primary">
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <Badge variant={scheme.eligibility === 'BPL' ? "destructive" : "secondary"}>
                  {scheme.eligibility}
                </Badge>
                <CheckCircle className="h-5 w-5 text-emerald-500" />
              </div>
              <CardTitle className="leading-tight">{scheme.name}</CardTitle>
              <CardDescription className="pt-2">{scheme.benefits}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              {/* Additional details could go here */}
            </CardContent>
            <CardFooter className="pt-0">
              <Button className="w-full" variant="outline">
                Apply Now <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
