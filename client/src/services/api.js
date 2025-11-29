const API_BASE = "/api";

export const api = {
  // Auth
  login: async (email, role) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, role }),
    });
    return res.json();
  },

  getUser: async (userId) => {
    const res = await fetch(`${API_BASE}/auth/user/${userId}`);
    return res.json();
  },

  // Households & Citizens
  getCitizenProfile: async (householdId) => {
    if (!householdId) return null;
    const res = await fetch(`${API_BASE}/households/${householdId}`);
    if (!res.ok) return null;
    return res.json();
  },

  getHouseholds: async () => {
    const res = await fetch(`${API_BASE}/households/ward/WARD-KL-ER-12`);
    return res.json();
  },

  getHouseholdsByWard: async (wardId) => {
    const res = await fetch(`${API_BASE}/households/ward/${wardId}`);
    return res.json();
  },

  getMembersByWard: async (wardId) => {
    const res = await fetch(`${API_BASE}/members/ward/${wardId}`);
    return res.json();
  },

  // Search
  searchPatient: async (query) => {
    const res = await fetch(`${API_BASE}/search/patients?q=${encodeURIComponent(query)}`);
    return res.json();
  },

  // Update household
  updateHousehold: async (householdId, data) => {
    const res = await fetch(`${API_BASE}/households/${householdId}/update`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  addPatientNote: async (citizenId, note) => {
    return { success: true };
  },

  // Vaccinations
  addVaccination: async (memberId, vaccine_name, vaccination_date) => {
    const res = await fetch(`${API_BASE}/vaccinations/member/${memberId}/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vaccine_name, vaccination_date }),
    });
    return res.json();
  },

  getVaccinations: async (memberId) => {
    const res = await fetch(`${API_BASE}/vaccinations/member/${memberId}`);
    return res.json();
  },

  // Mock: Eligible schemes
  getEligibleSchemes: async (incomeCategory) => {
    const schemes = [
      { id: 1, name: 'Ayushman Bharat', eligibility: 'BPL', benefits: 'Free treatment up to ₹5 Lakhs' },
      { id: 2, name: 'Janani Suraksha Yojana', eligibility: 'All', benefits: 'Cash assistance for institutional delivery' },
      { id: 3, name: 'Mission Indradhanush', eligibility: 'All', benefits: 'Free vaccination for children & pregnant women' }
    ];
    if (incomeCategory === 'BPL') return schemes;
    return schemes.filter(s => s.eligibility === 'All');
  },

  // ASHA Workers management
  getAshaWorkers: async () => {
    const res = await fetch(`${API_BASE}/asha-workers`);
    return res.json();
  },

  getAshaWorkersByWard: async (wardId) => {
    const res = await fetch(`${API_BASE}/asha-workers/ward/${wardId}`);
    return res.json();
  },

  createAshaWorker: async (data) => {
    const res = await fetch(`${API_BASE}/asha-workers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  updateAshaWorker: async (ashaId, data) => {
    const res = await fetch(`${API_BASE}/asha-workers/${ashaId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  deleteAshaWorker: async (ashaId) => {
    const res = await fetch(`${API_BASE}/asha-workers/${ashaId}`, {
      method: "DELETE",
    });
    return res.json();
  },

  // Wards
  getWards: async () => {
    const res = await fetch(`${API_BASE}/wards`);
    return res.json();
  },

  // All households (for admin)
  getAllHouseholds: async () => {
    const res = await fetch(`${API_BASE}/households/all`);
    return res.json();
  },

  // Create new household
  createHousehold: async (data) => {
    const res = await fetch(`${API_BASE}/households`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Mock: Dashboard stats
  getDashboardStats: async () => {
    return {
      activeCases: 1240,
      vaccinationsToday: 345,
      pendingSanitation: 28,
      alerts: [
        { id: 1, type: 'Epidemic', message: 'Dengue outbreak reported in Ward 12', severity: 'High' },
        { id: 2, type: 'Sanitation', message: 'Water stagnation reported in Block A', severity: 'Medium' },
        { id: 3, type: 'Vaccination', message: 'Polio drive scheduled for next Sunday', severity: 'Low' }
      ]
    };
  }
};
