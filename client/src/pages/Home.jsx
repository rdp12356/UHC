import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Loader2, ArrowRight } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocation } from "wouter";

export default function Home() {
  const [, navigate] = useLocation();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState("citizen");
  const [wardId, setWardId] = useState("");
  const [wards, setWards] = useState([]);
  const [email, setEmail] = useState("");
  const [householdId, setHouseholdId] = useState("");

  useEffect(() => {
    fetch('/api/wards').then(r => r.json()).then(data => setWards(data || [])).catch(() => setWards([]));
  }, []);

  const demoCredentials = {
    citizen: { email: "citizen@uhc.in" },
    doctor: { email: "doctor@uhc.in" },
    asha: { email: "" },
    gov: { email: "gov@uhc.in" },
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    let loginEmail = email || demoCredentials[role].email;
    
    if (role === 'asha' && !wardId) {
      setIsLoading(false);
      return;
    }
    
    if (role === 'citizen' && !householdId) {
      loginEmail = demoCredentials.citizen.email;
    }
    
    await login(loginEmail, role, wardId, householdId);
    setIsLoading(false);
  };

  const publicLinks = [
    { label: "View Categories", path: "/categories", icon: "📊" },
    { label: "How It Works", path: "/how-it-works", icon: "🔄" },
    { label: "Hospital Network", path: "/hospitals", icon: "🏥" },
    { label: "Check Your UHC", path: "/check-uhc", icon: "🔍" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-green-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900">
      {/* Header Navigation */}
      <div className="bg-white dark:bg-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <span className="font-bold text-lg text-slate-900 dark:text-white">UHC Portal</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {publicLinks.map((link) => (
              <Button
                key={link.path}
                variant="ghost"
                size="sm"
                onClick={() => navigate(link.path)}
                className="text-xs md:text-sm"
              >
                {link.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-4">
        <div className="mb-8 text-center space-y-2 max-w-2xl">
          <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-blue-500 to-green-500 rounded-2xl shadow-lg mb-4">
            <Activity className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            UHC – Unique Health Code
          </h1>
          <p className="text-muted-foreground text-xl max-w-md mx-auto">
            Digital Health Identity for Every Citizen. A comprehensive healthcare platform connecting citizens, doctors, ASHA workers, and government officials.
          </p>
        </div>

        {/* Public Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 max-w-6xl mx-auto">
        {publicLinks.map((link) => (
          <Card
            key={link.path}
            className="cursor-pointer hover:shadow-lg transition-all hover:border-blue-500 dark:hover:border-blue-400"
            onClick={() => navigate(link.path)}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-2xl">{link.icon}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-semibold text-slate-900 dark:text-white mb-2">{link.label}</p>
              <Button variant="ghost" size="sm" className="gap-1 p-0">
                Learn more <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
        </div>
      </div>

      <Card className="w-full max-w-md shadow-xl border-t-4 border-t-primary mx-auto">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
          <CardDescription className="text-center">
            Select your role to access the portal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="role">I am a...</Label>
                <Select value={role} onValueChange={(v) => { setRole(v); setEmail(""); setWardId(""); setHouseholdId(""); }} data-testid="select-role">
                  <SelectTrigger id="role" className="h-12" data-testid="select-role-trigger">
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="citizen" data-testid="option-citizen">Citizen</SelectItem>
                    <SelectItem value="doctor" data-testid="option-doctor">Doctor</SelectItem>
                    <SelectItem value="asha" data-testid="option-asha">ASHA Worker</SelectItem>
                    <SelectItem value="gov" data-testid="option-gov">Government Official</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {role === 'asha' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="ward">Select Your Ward</Label>
                    <Select value={wardId} onValueChange={setWardId} data-testid="select-ward">
                      <SelectTrigger id="ward" className="h-12" data-testid="select-ward-trigger">
                        <SelectValue placeholder="Choose your assigned ward" />
                      </SelectTrigger>
                      <SelectContent>
                        {wards.map((w) => (
                          <SelectItem key={w.ward_id} value={w.ward_id} data-testid={`option-ward-${w.ward_id}`}>
                            Ward {w.ward_number} - {w.ward_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="asha-email">ASHA Worker Email</Label>
                    <Input 
                      id="asha-email" 
                      type="email" 
                      placeholder="your.name@asha.uhc.in"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      data-testid="input-asha-email"
                    />
                  </div>
                </>
              )}

              {role === 'citizen' && (
                <div className="space-y-2">
                  <Label htmlFor="uhc-id">Your UHC ID (Household ID)</Label>
                  <Input 
                    id="uhc-id" 
                    type="text" 
                    placeholder="HH-12-0001 or UHC-2025-XXXX"
                    value={householdId}
                    onChange={(e) => setHouseholdId(e.target.value)}
                    data-testid="input-uhc-id"
                  />
                  <p className="text-xs text-muted-foreground">Enter your household UHC ID provided by ASHA worker</p>
                </div>
              )}
              
              {role !== 'asha' && role !== 'citizen' && (
                <div className="p-3 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 text-sm rounded-md border border-blue-100 dark:border-blue-900">
                  <p><strong>Demo Credentials:</strong></p>
                  <p>Email: {demoCredentials[role].email}</p>
                  <p>Password: demo</p>
                </div>
              )}

              {role === 'citizen' && !householdId && (
                <div className="p-3 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 text-sm rounded-md border border-amber-100 dark:border-amber-900">
                  <p><strong>Demo Mode:</strong> Leave blank to use demo household (HH-12-0001)</p>
                </div>
              )}

              {role === 'asha' && !wardId && (
                <div className="p-3 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 text-sm rounded-md border border-amber-100 dark:border-amber-900">
                  <p><strong>Required:</strong> Please select your assigned ward to continue</p>
                </div>
              )}

              <Button 
                className="w-full h-11 text-base" 
                type="submit" 
                disabled={isLoading || (role === 'asha' && !wardId)}
                data-testid="button-login"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Secure Login"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t pt-6">
          <p className="text-xs text-muted-foreground text-center">
            Secure Government of India Portal. <br/>
            By logging in, you agree to the Terms of Service.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
