import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Syringe, Activity, Droplets, User, Home, QrCode, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

export default function PublicPortal() {
  const [, navigate] = useLocation();
  const [uhcId, setUhcId] = useState("");
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [citizenData, setCitizenData] = useState(null);

  const handleSearch = async () => {
    if (!uhcId.trim()) return;
    
    // Mock data for demo
    setCitizenData({
      name: "Ramesh Kumar",
      age: 45,
      gender: "Male",
      uhcId: uhcId,
      category: "25000",
      ward: "Gandhi Nagar, Ward 12",
      linkedAsha: "Anitha K",
      vaccinationStatus: {
        total: 8,
        completed: 6,
        percentage: 75
      },
      cleanliness: 82,
      lastVisit: "2024-11-25",
      treatments: [
        { date: "2024-11-25", hospital: "Government Hospital", type: "Checkup" },
        { date: "2024-11-10", hospital: "Lourdes Hospital", type: "Vaccination" }
      ]
    });
    setSearchPerformed(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50 dark:from-slate-950 dark:to-slate-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="mb-6 gap-2">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <div className="text-center mb-8 space-y-4">
          <div className="flex justify-center mb-4">
            <div className="bg-white dark:bg-slate-800 p-4 rounded-full shadow-lg">
              <QrCode className="h-12 w-12 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Public Health Portal</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Check your UHC health record and vaccination status
          </p>
        </div>

        {/* Search Section */}
        <Card className="mb-8 shadow-lg border-t-4 border-t-green-500">
          <CardHeader>
            <CardTitle>Search Your UHC Record</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter your UHC ID (e.g., UHC-2024-0001)"
                value={uhcId}
                onChange={(e) => setUhcId(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button onClick={handleSearch} className="bg-green-600 hover:bg-green-700">
                Search
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        {searchPerformed && citizenData ? (
          <div className="space-y-6">
            {/* Profile Card */}
            <Card className="shadow-lg border-l-4 border-l-blue-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <User className="h-6 w-6" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Name</p>
                    <p className="text-lg font-semibold">{citizenData.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">UHC ID</p>
                    <p className="text-lg font-mono font-semibold">{citizenData.uhcId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Category</p>
                    <Badge className="bg-blue-100 text-blue-800">₹{citizenData.category}</Badge>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Ward</p>
                    <p className="text-base">{citizenData.ward}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Linked ASHA Worker</p>
                    <p className="text-base font-semibold">{citizenData.linkedAsha}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Health Metrics */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="border-l-4 border-l-green-500 shadow-md">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      <Syringe className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{citizenData.vaccinationStatus.percentage}%</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Vaccination Complete</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-orange-500 shadow-md">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                      <Droplets className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{citizenData.cleanliness}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Cleanliness Score</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-blue-500 shadow-md">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <Activity className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{citizenData.vaccinationStatus.completed}/{citizenData.vaccinationStatus.total}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Vaccinations</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Treatment History */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  Treatment History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {citizenData.treatments.map((treatment, i) => (
                    <div key={i} className="border-l-4 border-blue-300 pl-4 py-2">
                      <p className="font-semibold text-slate-900 dark:text-white">{treatment.hospital}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{treatment.type} • {treatment.date}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : searchPerformed ? (
          <Card className="text-center py-12">
            <p className="text-slate-600 dark:text-slate-400">No record found for this UHC ID</p>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
