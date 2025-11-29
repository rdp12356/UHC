import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Home() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState("citizen");

  // Pre-fill logic for demo
  const demoCredentials = {
    citizen: { email: "citizen@uhc.in", pass: "demo" },
    doctor: { email: "doctor@uhc.in", pass: "demo" },
    asha: { email: "asha@uhc.in", pass: "demo" },
    gov: { email: "gov@uhc.in", pass: "demo" },
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const creds = demoCredentials[role];
    await login(creds.email, role);
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
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger id="role" className="h-12">
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="citizen">Citizen</SelectItem>
                    <SelectItem value="doctor">Doctor</SelectItem>
                    <SelectItem value="asha">ASHA Worker</SelectItem>
                    <SelectItem value="gov">Government Official</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="p-3 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 text-sm rounded-md border border-blue-100 dark:border-blue-900">
                <p><strong>Demo Credentials:</strong></p>
                <p>Email: {demoCredentials[role].email}</p>
                <p>Password: demo</p>
              </div>

              <Button className="w-full h-11 text-base" type="submit" disabled={isLoading}>
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
