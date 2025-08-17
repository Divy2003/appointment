import mongoose from 'mongoose';
import Appointment from '../models/Appointment.js';
import Patient from '../models/Patient.js';
import Doctor from '../models/Doctor.js';

// Create new appointment
export const createAppointment = async (req, res) => {
  try {
    const { patientData, doctorIds, reason } = req.body;

    // Create or find patient
    let patient = await Patient.findOne({ phone: patientData.phone });
    if (!patient) {
      patient = new Patient(patientData);
      await patient.save();
    } else {
      // Update patient data if provided
      Object.assign(patient, patientData);
      await patient.save();
    }

    const appointments = [];
    for (const doctorId of doctorIds) {
      // Check if doctor exists
      const doctor = await Doctor.findById(doctorId);
      if (!doctor) {
        // In a real-world scenario, you might want to handle this more gracefully
        // For example, by collecting all invalid doctor IDs and returning an error
        continue;
      }

      // Get next queue number for today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const lastAppointment = await Appointment.findOne({
        doctor: doctorId,
        appointmentDate: {
          $gte: today,
          $lt: tomorrow
        }
      }).sort({ queueNumber: -1 });

      const queueNumber = lastAppointment ? lastAppointment.queueNumber + 1 : 1;

      // Create appointment
      const appointment = new Appointment({
        patient: patient._id,
        doctor: doctorId,
        queueNumber,
        reason,
      });

      await appointment.save();

      // Populate the appointment data
      await appointment.populate('patient', 'name phone age gender');
      await appointment.populate('doctor', 'name specialization');

      appointments.push(appointment);

      // Emit socket event for real-time updates
      req.io.to(`doctor_${doctorId}`).emit('newAppointment', {
        appointment: await appointment.populate('patient', 'name phone age gender')
      });
    }

    res.status(201).json({
      success: true,
      data: {
        appointments
      },
      message: 'Appointments created successfully'
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating appointments',
      error: error.message
    });
  }
};

// Update appointment status
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { status, notes } = req.body;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Update status and timestamps
    appointment.status = status;
    if (notes) appointment.notes = notes;

    if (status === 'in-progress' && !appointment.actualStartTime) {
      appointment.actualStartTime = new Date();
    } else if (status === 'completed' || status === 'cancelled') {
      appointment.actualEndTime = new Date();
      appointment.queueType = status;
    }

    await appointment.save();
    await appointment.populate('patient', 'name phone age gender');

    res.json({
      success: true,
      data: appointment,
      message: 'Appointment status updated successfully'
    });

    // Emit socket event for real-time updates
    req.io.to(`doctor_${appointment.doctor}`).emit('appointmentUpdated', {
      appointment
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating appointment status',
      error: error.message
    });
  }
};

// Move appointment to late queue
export const moveToLateQueue = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    appointment.queueType = 'late';
    appointment.status = 'late';
    await appointment.save();
    await appointment.populate('patient', 'name phone age gender');

    res.json({
      success: true,
      data: appointment,
      message: 'Appointment moved to late queue'
    });

    // Emit socket event for real-time updates
    req.io.to(`doctor_${appointment.doctor}`).emit('appointmentMovedToLate', {
      appointment
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error moving appointment to late queue',
      error: error.message
    });
  }
};

// Get patient's appointments
export const getPatientAppointments = async (req, res) => {
  try {
    const { phone } = req.params;
    
    const patient = await Patient.findOne({ phone });
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    const appointments = await Appointment.find({ patient: patient._id })
      .populate('doctor', 'name specialization')
      .sort({ appointmentDate: -1 });

    res.json({
      success: true,
      data: appointments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching patient appointments',
      error: error.message
    });
  }
};

// Get appointment statistics
export const getAppointmentStats = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const stats = await Appointment.aggregate([
      {
        $match: {
          doctor: mongoose.Types.ObjectId(doctorId),
          appointmentDate: {
            $gte: today,
            $lt: tomorrow
          }
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const formattedStats = {
      total: 0,
      waiting: 0,
      inProgress: 0,
      completed: 0,
      cancelled: 0,
      late: 0
    };

    stats.forEach(stat => {
      formattedStats[stat._id.replace('-', '')] = stat.count;
      formattedStats.total += stat.count;
    });

    res.json({
      success: true,
      data: formattedStats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching appointment statistics',
      error: error.message
    });
  }
};