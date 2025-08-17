import express from 'express';
import {
  createAppointment,
  updateAppointmentStatus,
  moveToLateQueue,
  getPatientAppointments,
  getAppointmentStats
} from '../controllers/appointmentController.js';

const router = express.Router();

// POST /api/appointments - Create new appointment
router.post('/', createAppointment);

// PUT /api/appointments/:appointmentId/status - Update appointment status
router.put('/:appointmentId/status', updateAppointmentStatus);

// PUT /api/appointments/:appointmentId/late - Move to late queue
router.put('/:appointmentId/late', moveToLateQueue);

// GET /api/appointments/patient/:phone - Get patient's appointments
router.get('/patient/:phone', getPatientAppointments);

// GET /api/appointments/stats/:doctorId - Get appointment statistics
router.get('/stats/:doctorId', getAppointmentStats);

export default router;