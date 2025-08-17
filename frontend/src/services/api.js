import axios from 'axios';

const API_BASE_URL = 'http://localhost:12000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const doctorAPI = {
  getAllDoctors: () => api.get('/doctors'),
  getDoctorById: (id) => api.get(`/doctors/${id}`),
  getDoctorQueue: (doctorId) => api.get(`/doctors/${doctorId}/queue`),
};

export const appointmentAPI = {
  createAppointment: (appointmentData) => api.post('/appointments', appointmentData),
  getAppointmentByQR: (qrCode) => api.get(`/appointments/qr/${qrCode}`),
  updateAppointmentStatus: (appointmentId, statusData) => 
    api.put(`/appointments/${appointmentId}/status`, statusData),
  moveToLateQueue: (appointmentId) => api.put(`/appointments/${appointmentId}/late`),
  getPatientAppointments: (phone) => api.get(`/appointments/patient/${phone}`),
};

export default api;