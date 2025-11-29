// Mock Data Service API

// Mock Database
const db = {
  citizens: [
    {
      id: 'c1',
      user_id: 'u1',
      uhc_id: 'UHC-2025-8891',
      name: 'Rahul Sharma',
      dob: '1985-06-15',
      gender: 'Male',
      ward: '12',
      income_category: 'BPL',
      address: '123, Gandhi Nagar, New Delhi',
      blood_group: 'O+',
      timeline: [
        { date: '2024-11-10', type: 'Vaccination', title: 'COVID-19 Booster', details: 'Covishield Dose 3' },
        { date: '2024-08-05', type: 'Visit', title: 'General Checkup', details: 'Fever and cold symptoms' },
        { date: '2023-12-20', type: 'Lab', title: 'Blood Test', details: 'Hemoglobin: 13.5 g/dL' }
      ]
    },
    {
      id: 'c2',
      user_id: 'u5', // Not a logged in user for demo
      uhc_id: 'UHC-2025-9922',
      name: 'Priya Singh',
      dob: '1990-02-20',
      gender: 'Female',
      ward: '14',
      income_category: 'APL',
      address: '45, Civil Lines, New Delhi',
      blood_group: 'B+',
      timeline: []
    }
  ],
  schemes: [
    { id: 1, name: 'Ayushman Bharat', eligibility: 'BPL', benefits: 'Free treatment up to ₹5 Lakhs' },
    { id: 2, name: 'Janani Suraksha Yojana', eligibility: 'All', benefits: 'Cash assistance for institutional delivery' },
    { id: 3, name: 'Mission Indradhanush', eligibility: 'All', benefits: 'Free vaccination for children & pregnant women' }
  ],
  doctors: [
    { id: 'd1', user_id: 'u2', name: 'Dr. Anjali Gupta', reg_number: 'REG-4455', hospital: 'City General Hospital', verified: true }
  ],
  households: [
    { id: 'h1', head: 'Ramesh Kumar', address: 'Block A, Slum Cluster 4', members: 5, sanitation_status: 'Pending', last_visit: '2024-10-01' },
    { id: 'h2', head: 'Sita Devi', address: 'Block B, Slum Cluster 4', members: 3, sanitation_status: 'Good', last_visit: '2024-10-15' }
  ],
  stats: {
    activeCases: 1240,
    vaccinationsToday: 345,
    pendingSanitation: 28,
    alerts: [
      { id: 1, type: 'Epidemic', message: 'Dengue outbreak reported in Ward 12', severity: 'High' },
      { id: 2, type: 'Sanitation', message: 'Water stagnation reported in Block A', severity: 'Medium' },
      { id: 3, type: 'Vaccination', message: 'Polio drive scheduled for next Sunday', severity: 'Low' }
    ]
  }
};

export const api = {
  // Citizen Methods
  getCitizenProfile: async (userId) => {
    return new Promise(resolve => {
      setTimeout(() => {
        const citizen = db.citizens.find(c => c.user_id === userId);
        resolve(citizen);
      }, 500);
    });
  },
  getEligibleSchemes: async (incomeCategory) => {
    return new Promise(resolve => {
      setTimeout(() => {
        if (incomeCategory === 'BPL') return resolve(db.schemes);
        return resolve(db.schemes.filter(s => s.eligibility === 'All'));
      }, 500);
    });
  },

  // Doctor Methods
  searchPatient: async (query) => {
    return new Promise(resolve => {
      setTimeout(() => {
        const results = db.citizens.filter(c => 
          c.uhc_id.toLowerCase().includes(query.toLowerCase()) || 
          c.name.toLowerCase().includes(query.toLowerCase())
        );
        resolve(results);
      }, 600);
    });
  },
  addPatientNote: async (citizenId, note) => {
    return new Promise(resolve => {
      setTimeout(() => {
        const citizen = db.citizens.find(c => c.id === citizenId);
        if (citizen) {
          citizen.timeline.unshift({
            date: new Date().toISOString().split('T')[0],
            type: 'Doctor Note',
            title: note.diagnosis,
            details: note.details
          });
        }
        resolve({ success: true });
      }, 600);
    });
  },

  // ASHA Methods
  getHouseholds: async () => {
    return new Promise(resolve => setTimeout(() => resolve(db.households), 500));
  },
  updateHousehold: async (id, data) => {
    return new Promise(resolve => {
      setTimeout(() => {
        const idx = db.households.findIndex(h => h.id === id);
        if (idx !== -1) {
          db.households[idx] = { ...db.households[idx], ...data };
        }
        resolve({ success: true });
      }, 500);
    });
  },

  // Government Methods
  getDashboardStats: async () => {
    return new Promise(resolve => setTimeout(() => resolve(db.stats), 800));
  }
};
