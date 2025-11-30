import { Card, CardContent } from "@/components/ui/card";
import { Users, ID, Building2, FileText, Landmark, DollarSign } from "lucide-react";

export default function HowItWorks() {
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
      description: "System assigns UHC ID in 4 categories based on income/health needs",
      icon: ID,
      color: "bg-green-100 dark:bg-green-900"
    },
    {
      number: 3,
      title: "Hospital Network Link",
      description: "UHC ID links to network of government and private hospitals",
      icon: Building2,
      color: "bg-purple-100 dark:bg-purple-900"
    },
    {
      number: 4,
      title: "Treatment Records",
      description: "All treatments, vaccinations, and health data recorded in system",
      icon: FileText,
      color: "bg-orange-100 dark:bg-orange-900"
    },
    {
      number: 5,
      title: "Govt Funding Review",
      description: "Government officials review cases for funding eligibility",
      icon: Landmark,
      color: "bg-red-100 dark:bg-red-900"
    },
    {
      number: 6,
      title: "Fund Allocation",
      description: "Budget allocation (% of govt budget + % of GST collection)",
      icon: DollarSign,
      color: "bg-emerald-100 dark:bg-emerald-900"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50 dark:from-slate-950 dark:to-slate-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white">How UHC Works</h1>
          <p className="text-xl text-slate-600 dark:text-slate-400">
            Complete health identity system from registration to funding
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                {step.number < 6 && (
                  <div className="hidden lg:block absolute -right-4 top-8 w-8 h-0.5 bg-gradient-to-r from-blue-400 to-green-400" />
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-16 bg-white dark:bg-slate-800 rounded-lg p-8 shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Funding Distribution Model</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">40%</div>
              <p className="text-slate-700 dark:text-slate-300">Government Budget Allocation</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">From annual health ministry budget</p>
            </div>
            <div className="space-y-3">
              <div className="text-4xl font-bold text-green-600 dark:text-green-400">45%</div>
              <p className="text-slate-700 dark:text-slate-300">GST Collection Share</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">From healthcare GST revenue</p>
            </div>
            <div className="space-y-3">
              <div className="text-4xl font-bold text-purple-600 dark:text-purple-400">15%</div>
              <p className="text-slate-700 dark:text-slate-300">Administrative Overhead</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">System maintenance and operations</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
