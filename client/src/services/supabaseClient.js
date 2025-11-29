
// Mock Supabase Client for Prototype
// This simulates Supabase functionality locally without a real backend connection.

export const supabase = {
  auth: {
    getUser: async () => {
      const user = localStorage.getItem('uhc_user');
      return { data: { user: user ? JSON.parse(user) : null }, error: null };
    },
    signInWithPassword: async ({ email, password }) => {
      // Simulate login delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock users
      const users = [
        { id: 'u1', email: 'citizen@uhc.in', role: 'citizen', user_metadata: { full_name: 'Rahul Sharma' } },
        { id: 'u2', email: 'doctor@uhc.in', role: 'doctor', user_metadata: { full_name: 'Dr. Anjali Gupta' } },
        { id: 'u3', email: 'asha@uhc.in', role: 'asha', user_metadata: { full_name: 'Sunita Devi' } },
        { id: 'u4', email: 'gov@uhc.in', role: 'gov', user_metadata: { full_name: 'District Health Officer' } },
      ];

      const user = users.find(u => u.email === email);
      
      if (user) {
        localStorage.setItem('uhc_user', JSON.stringify(user));
        return { data: { user, session: { access_token: 'mock-token' } }, error: null };
      }
      
      return { data: null, error: { message: 'Invalid credentials' } };
    },
    signOut: async () => {
      localStorage.removeItem('uhc_user');
      return { error: null };
    },
    onAuthStateChange: (callback) => {
      // Simple mock implementation
      const user = localStorage.getItem('uhc_user');
      callback('SIGNED_IN', { user: user ? JSON.parse(user) : null });
      return { data: { subscription: { unsubscribe: () => {} } } };
    }
  },
  from: (table) => {
    return {
      select: () => ({
        eq: () => ({ single: () => ({ data: {}, error: null }) }),
        // Add more mock chainable methods as needed for specific queries
      })
    };
  }
};
