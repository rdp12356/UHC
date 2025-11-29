import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Home() {
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      
      <div className="mb-8 text-center space-y-2">
        <div className="inline-flex items-center justify-center p-4 bg-primary rounded-2xl shadow-lg mb-4">
          <Activity className="h-10 w-10 text-primary-foreground" />
        </div>
        <h1 className="text-4xl font-serif font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          UHC Portal
        </h1>
        <p className="text-muted-foreground text-lg max-w-md mx-auto">
          Unique Health Code: A unified digital health platform for every citizen.
        </p>
      </div>

      <Card className="w-full max-w-md shadow-xl border-t-4 border-t-primary">
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
