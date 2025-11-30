import { Card, CardContent } from "@/components/ui/card";
import { Users, Barcode, Building2, FileText, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function HowItWorks() {
  const [, navigate] = useLocation();
  const steps = [
    {
      number: 1,
      title: "Public Registration",
      description: "Citizens register through ASHA workers or public portals",
      icon: Users,
      color: "bg-blue-100 dark:bg-blue-900"
    },
    {
      number: 2,
      title: "Unique ID Generation",
      description: "System assigns UHC ID in 4 categories based on income and health needs",
      icon: Barcode,
      color: "bg-green-100 dark:bg-green-900"
    },
    {
      number: 3,
      title: "Hospital Network Link",
      description: "UHC ID links citizens to network of government and private hospitals",
      icon: Building2,
      color: "bg-purple-100 dark:bg-purple-900"
    },
    {
      number: 4,
      title: "Health Records Management",
      description: "All treatments, vaccinations, and health data securely recorded and managed",
      icon: FileText,
      color: "bg-orange-100 dark:bg-orange-900"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50 dark:from-slate-950 dark:to-slate-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="mb-6 gap-2">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white">How UHC Works</h1>
          <p className="text-xl text-slate-600 dark:text-slate-400">
            Four-step process to establish digital health identity
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => {
            const IconComponent = step.icon;
            return (
              <div key={step.number} className="relative">
                <Card className="h-full hover:shadow-lg transition-all">
                  <CardContent className="pt-6 space-y-4">
                    <div className={`w-14 h-14 rounded-full ${step.color} flex items-center justify-center`}>
                      <span className="text-2xl font-bold text-slate-900 dark:text-white">{step.number}</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{step.title}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{step.description}</p>
                    </div>
                    <IconComponent className="h-8 w-8 text-slate-400 dark:text-slate-600" />
                  </CardContent>
                </Card>
                {step.number < 4 && (
                  <div className="hidden lg:block absolute -right-4 top-8 w-8 h-0.5 bg-gradient-to-r from-blue-400 to-green-400" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
