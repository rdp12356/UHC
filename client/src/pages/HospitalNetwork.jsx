import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Building2, MapPin, Phone, Star, Search, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

export default function HospitalNetwork() {
  const [, navigate] = useLocation();
  const [hospitals] = useState([
    {
      hospital_id: "1",
      name: "Government Medical College Hospital",
      address: "Kottayam, Kerala",
      city: "Kottayam",
      type: "government",
      rating: 4.5,
      specializations: ["Cardiology", "Oncology", "Neurology"],
      phone: "+91-9847123456"
    },
    {
      hospital_id: "2",
      name: "Lourdes Hospital",
      address: "Cochin, Kerala",
      city: "Cochin",
      type: "private",
      rating: 4.8,
      specializations: ["Pediatrics", "Orthopedics", "General Surgery"],
      phone: "+91-9876543210"
    },
    {
      hospital_id: "3",
      name: "Amrita Institute of Medical Sciences",
      address: "Cochin, Kerala",
      city: "Cochin",
      type: "private",
      rating: 4.9,
      specializations: ["Cardiothoracic", "Transplant", "Oncology"],
      phone: "+91-9845678901"
    },
    {
      hospital_id: "4",
      name: "District Hospital Ernakulam",
      address: "Ernakulam, Kerala",
      city: "Ernakulam",
      type: "government",
      rating: 4.2,
      specializations: ["General Medicine", "Maternity", "Emergency"],
      phone: "+91-9823456789"
    }
  ]);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredHospitals = hospitals.filter(h =>
    h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTypeColor = (type) => {
    switch(type) {
      case "government": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "private": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "ngo": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      default: return "bg-slate-100 text-slate-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-slate-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="mb-6 gap-2">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <div className="mb-8 space-y-4">
          <div className="flex items-center gap-3">
            <Building2 className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Hospital Network</h1>
          </div>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Partner hospitals providing comprehensive healthcare services to UHC citizens
          </p>
        </div>

        <div className="mb-8 relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
          <Input
            placeholder="Search by hospital name or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {filteredHospitals.map((hospital) => (
            <Card key={hospital.hospital_id} className="hover:shadow-lg transition-all border-l-4 border-l-blue-500">
              <CardHeader>
                <div className="flex items-start justify-between mb-3">
                  <CardTitle className="flex-1">{hospital.name}</CardTitle>
                  <Badge className={getTypeColor(hospital.type)}>
                    {hospital.type.charAt(0).toUpperCase() + hospital.type.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <MapPin className="h-4 w-4 flex-shrink-0" />
                  <span>{hospital.address}</span>
                </div>
                
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <Phone className="h-4 w-4 flex-shrink-0" />
                  <span>{hospital.phone}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                  <span className="font-semibold">{hospital.rating}/5</span>
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Specializations</p>
                  <div className="flex flex-wrap gap-2">
                    {hospital.specializations.map((spec, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredHospitals.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-600 dark:text-slate-400">No hospitals found matching your search</p>
          </div>
        )}
      </div>
    </div>
  );
}
