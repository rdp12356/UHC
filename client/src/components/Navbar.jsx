import { Link, useLocation } from "wouter";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  User, 
  LogOut, 
  Activity, 
  FileText, 
  ShieldCheck, 
  Users, 
  ClipboardList, 
  Upload, 
  BarChart3, 
  AlertTriangle,
  Stethoscope
} from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [location] = useLocation();

  if (!user) return null;

  const role = user.role;

  const getNavItems = () => {
    switch (role) {
      case 'citizen':
        return [
          { label: 'Dashboard', path: '/citizen/dashboard', icon: Activity },
          { label: 'Timeline', path: '/citizen/timeline', icon: FileText },
          { label: 'Schemes', path: '/citizen/schemes', icon: ShieldCheck },
        ];
      case 'doctor':
        return [
          { label: 'Search Patients', path: '/doctor/search', icon: Users },
          { label: 'Patient Record', path: '/doctor/record', icon: ClipboardList },
          { label: 'Add Diagnosis', path: '/doctor/add-notes', icon: Stethoscope },
        ];
      case 'asha':
        return [
          { label: 'Households', path: '/asha/households', icon: Users },
          { label: 'Ward Members', path: '/asha/members', icon: Users },
          { label: 'Submit Form', path: '/asha/submit', icon: ClipboardList },
          { label: 'CSV Upload', path: '/asha/upload', icon: Upload },
        ];
      case 'gov':
        return [
          { label: 'Dashboard', path: '/gov/dashboard', icon: BarChart3 },
          { label: 'Alerts', path: '/gov/alerts', icon: AlertTriangle },
          { label: 'Admin Panel', path: '/gov/admin', icon: Users },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <nav className="border-b bg-card text-card-foreground sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
            <Activity className="h-6 w-6" />
          </div>
          <span className="font-serif font-bold text-xl tracking-tight text-primary">UHC</span>
          <span className="text-muted-foreground text-sm hidden sm:inline-block">| {role.toUpperCase()} Portal</span>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.path;
              return (
                <Link key={item.path} href={item.path}>
                  <div className={`
                    flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer
                    ${isActive 
                      ? 'bg-primary/10 text-primary' 
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'}
                  `}>
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">{user.user_metadata?.full_name}</p>
              <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={logout} title="Logout">
              <LogOut className="h-5 w-5 text-muted-foreground hover:text-destructive transition-colors" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile Nav */}
      <div className="md:hidden border-t flex justify-around p-2 bg-background">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.path;
          return (
             <Link key={item.path} href={item.path}>
              <div className={`
                flex flex-col items-center justify-center p-2 rounded-md transition-colors w-full cursor-pointer
                ${isActive ? 'text-primary' : 'text-muted-foreground'}
              `}>
                <Icon className="h-5 w-5 mb-1" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
