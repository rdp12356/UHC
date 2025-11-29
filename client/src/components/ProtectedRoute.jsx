import { useAuth } from "../context/AuthContext";
import { Redirect } from "wouter";
import { Loader2 } from "lucide-react";

export default function ProtectedRoute({ component: Component, allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Redirect to="/" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to their own dashboard if they try to access unauthorized pages
    if (user.role === 'citizen') return <Redirect to="/citizen/dashboard" />;
    if (user.role === 'doctor') return <Redirect to="/doctor/search" />;
    if (user.role === 'asha') return <Redirect to="/asha/households" />;
    if (user.role === 'gov') return <Redirect to="/gov/dashboard" />;
    return <Redirect to="/" />;
  }

  return <Component />;
}
