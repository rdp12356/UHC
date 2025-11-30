import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Stethoscope, Users, Briefcase, BarChart3, LogOut, User } from "lucide-react";

export default function PortalHome() {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  if (!user) return null;

  const portals = {
    citizen: {
      name: "Citizen Portal",
      description: "View your health records, vaccinations, and schemes",
      icon: User,
      color: "from-blue-500 to-blue-600",
      path: "/citizen/dashboard"
    },
    doctor: {
      name: "Doctor Portal",
      description: "Manage appointments and patient records",
      icon: Stethoscope,
      color: "from-green-500 to-green-600",
      path: "/doctor/dashboard"
    },
    asha: {
      name: "ASHA Worker Portal",
      description: "Manage households and conduct surveys",
      icon: Users,
      color: "from-purple-500 to-purple-600",
      path: "/asha/households"
    },
    gov: {
      name: "Government Portal",
      description: "Analytics, alerts, and ward management",
      icon: BarChart3,
      color: "from-orange-500 to-orange-600",
      path: "/gov/dashboard"
    }
  };

  const currentPortal = portals[user.role];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">UHC</span>
            </div>
            <div>
              <h1 className="font-bold text-lg text-slate-900 dark:text-white">Unique Health Code</h1>
              <p className="text-xs text-muted-foreground">Digital Health Platform</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-slate-900 dark:text-white">{user.full_name || user.email}</p>
              <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
            </div>
            <Button variant="outline" size="sm" onClick={logout} className="gap-2">
              <LogOut className="h-4 w-4" /> Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Welcome to {currentPortal.name}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {currentPortal.description}
          </p>
        </div>

        {/* Portal Card */}
        <div className="max-w-2xl mx-auto mb-12">
          <Card className={`bg-gradient-to-br ${currentPortal.color} border-0 shadow-xl`}>
            <CardContent className="p-12 text-center text-white">
              <div className="mb-6 flex justify-center">
                {currentPortal.icon && <currentPortal.icon className="h-16 w-16" />}
              </div>
              <h3 className="text-3xl font-bold mb-4">{currentPortal.name}</h3>
              <p className="text-white/90 mb-8 text-lg">{currentPortal.description}</p>
              <Button 
                onClick={() => navigate(currentPortal.path)}
                size="lg"
                className="bg-white text-slate-900 hover:bg-slate-100 font-semibold"
                data-testid="button-enter-portal"
              >
                Enter Portal →
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Links */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 text-center">Other Features</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="hover:shadow-lg transition-all cursor-pointer" onClick={() => navigate("/categories")} data-testid="link-categories">
              <CardHeader>
                <CardTitle className="text-lg">📊 UHC Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">View the 4 UHC health plan categories and their benefits</p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-all cursor-pointer" onClick={() => navigate("/how-it-works")} data-testid="link-workflow">
              <CardHeader>
                <CardTitle className="text-lg">🔄 How It Works</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Learn the UHC registration and health tracking workflow</p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-all cursor-pointer" onClick={() => navigate("/hospitals")} data-testid="link-hospitals">
              <CardHeader>
                <CardTitle className="text-lg">🏥 Hospital Network</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Browse partner hospitals across Kerala</p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-all cursor-pointer" onClick={() => navigate("/check-uhc")} data-testid="link-lookup">
              <CardHeader>
                <CardTitle className="text-lg">🔍 Lookup UHC ID</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Search health records by UHC ID</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
