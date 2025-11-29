import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Check active session
    const checkSession = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
      }
      setLoading(false);
    };
    checkSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email, role, wardId = null, householdId = null) => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role, ward_id: wardId, household_id: householdId }),
      });
      
      if (!response.ok) {
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: "Could not authenticate. Please try again.",
        });
        setLoading(false);
        return false;
      }
      
      const user = await response.json();
      setUser(user);
      
      toast({
        title: "Welcome back",
        description: `Logged in as ${user.role.toUpperCase()}`,
      });
      
      if (user.role === 'citizen') setLocation('/citizen/dashboard');
      else if (user.role === 'doctor') setLocation('/doctor/search');
      else if (user.role === 'asha') setLocation('/asha/households');
      else if (user.role === 'gov') setLocation('/gov/dashboard');
      
      setLoading(false);
      return true;
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: err.message,
      });
      setLoading(false);
      return false;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setLocation('/');
    toast({
      title: "Logged out",
      description: "See you soon!",
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
