import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IndianRupee, Crown, Heart, Shield, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function Categories() {
  const [, navigate] = useLocation();
  const categories = [
    {
      id: 1,
      amount: "₹10,000",
      title: "Basic Category",
      color: "blue",
      icon: Heart,
      features: ["Annual health checkup", "Basic vaccination support", "ASHA worker guidance"],
      accent: "from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900"
    },
    {
      id: 2,
      amount: "₹25,000",
      title: "Standard Category",
      color: "green",
      icon: Shield,
      features: ["Extended health coverage", "Advanced treatments", "Priority hospital access"],
      accent: "from-green-50 to-green-100 dark:from-green-950 dark:to-green-900"
    },
    {
      id: 3,
      amount: "₹30,000+",
      title: "Premium Category",
      color: "purple",
      icon: IndianRupee,
      features: ["Comprehensive coverage", "Specialist consultations", "Major surgery support"],
      accent: "from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900"
    },
    {
      id: 4,
      amount: "VIP",
      title: "VIP Category",
      color: "amber",
      icon: Crown,
      features: ["24/7 concierge service", "Top hospitals network", "Complete health management"],
      accent: "from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-slate-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="mb-6 gap-2">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white">UHC Categories</h1>
          <p className="text-xl text-slate-600 dark:text-slate-400">
            Four categories based on health coverage and family needs
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => {
            const IconComponent = cat.icon;
            return (
              <Card key={cat.id} className={`hover:shadow-lg transition-all border-l-4 bg-gradient-to-br ${cat.accent}`}>
                <CardHeader className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-lg font-bold">{cat.amount}</Badge>
                    <IconComponent className="h-6 w-6 text-slate-600 dark:text-slate-400" />
                  </div>
                  <CardTitle className="text-xl">{cat.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {cat.features.map((feature, i) => (
                      <li key={i} className="text-sm text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
