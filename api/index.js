import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Import routes - mock routes for Vercel
app.get('/api/wards', (req, res) => {
  res.json([{
    ward_id: 'WARD-KL-ER-12',
    state: 'Kerala',
    district: 'Ernakulam',
    ward_name: 'Gandhi Nagar',
    ward_number: 12,
    cleanliness_rate: 78,
    vaccination_completion_rate: 91
  }]);
});

app.get('/api/asha-workers', (req, res) => {
  res.json([
    { asha_id: 'ASHA-12-001', name: 'Priya Kumar', ward_id: 'WARD-KL-ER-12', status: 'active', phone: '+91-9876543210' },
    { asha_id: 'ASHA-12-002', name: 'Anjali Singh', ward_id: 'WARD-KL-ER-12', status: 'active', phone: '+91-9876543211' },
    { asha_id: 'ASHA-12-003', name: 'Meera Nair', ward_id: 'WARD-KL-ER-12', status: 'suspended', suspension_reason: 'Irregular visits', phone: '+91-9876543212' }
  ]);
});

app.get('/api/appointments/doctor/:doctorId', (req, res) => {
  res.json([
    { id: '1', doctor_id: req.params.doctorId, patient_id: 'UHC-2025-0001', appointment_date: '2025-12-05', appointment_time: '10:00 AM', reason: 'Regular checkup', notes: 'Blood pressure monitoring', status: 'scheduled' },
    { id: '2', doctor_id: req.params.doctorId, patient_id: 'UHC-2025-0002', appointment_date: '2025-12-06', appointment_time: '02:00 PM', reason: 'Follow-up consultation', notes: 'Diabetes management review', status: 'scheduled' }
  ]);
});

app.post('/api/asha/:ashaId/suspend', (req, res) => {
  const { reason, suspended_by } = req.body;
  res.json({ asha_id: req.params.ashaId, status: 'suspended', suspension_reason: reason, suspended_by, suspended_at: new Date().toISOString().split('T')[0] });
});

app.post('/api/asha/:ashaId/reactivate', (req, res) => {
  res.json({ asha_id: req.params.ashaId, status: 'active', suspension_reason: null, suspended_by: null, suspended_at: null });
});

app.post('/api/asha/:ashaId/reviews', (req, res) => {
  const { citizen_id, rating, review_text, visit_date } = req.body;
  res.json({ id: Math.random().toString(), asha_id: req.params.ashaId, citizen_id, rating, review_text, visit_date, created_at: new Date().toISOString().split('T')[0] });
});

app.get('/api/asha/:ashaId/reviews', (req, res) => {
  res.json([]);
});

// Catch all for 404
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

export default app;
