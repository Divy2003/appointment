import express from 'express';
import {
  getAllDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  getDoctorQueue
} from '../controllers/doctorController.js';

const router = express.Router();

// GET /api/doctors - Get all doctors
router.get('/', getAllDoctors);

// GET /api/doctors/:id - Get doctor by ID
router.get('/:id', getDoctorById);

// POST /api/doctors - Create new doctor
router.post('/', createDoctor);

// PUT /api/doctors/:id - Update doctor
router.put('/:id', updateDoctor);

// GET /api/doctors/:doctorId/queue - Get doctor's queue
router.get('/:doctorId/queue', getDoctorQueue);

export default router;