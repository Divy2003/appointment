import Doctor from '../models/Doctor.js';
import Appointment from '../models/Appointment.js';

// Get all doctors
export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({ isActive: true }).select('-__v');
    res.json({
      success: true,
      data: doctors
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching doctors',
      error: error.message
    });
  }
};

// Get doctor by ID
export const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }
    res.json({
      success: true,
      data: doctor
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching doctor',
      error: error.message
    });
  }
};

// Create new doctor
export const createDoctor = async (req, res) => {
  try {
    const doctor = new Doctor(req.body);
    await doctor.save();
    res.status(201).json({
      success: true,
      data: doctor,
      message: 'Doctor created successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating doctor',
      error: error.message
    });
  }
};

// Update doctor
export const updateDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }
    res.json({
      success: true,
      data: doctor,
      message: 'Doctor updated successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating doctor',
      error: error.message
    });
  }
};

// Get doctor's queue
export const getDoctorQueue = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const appointments = await Appointment.find({
      doctor: doctorId,
      appointmentDate: {
        $gte: today,
        $lt: tomorrow
      }
    })
    .populate('patient', 'name phone age gender')
    .sort({ queueNumber: 1 });

    const regularQueue = appointments.filter(apt => apt.queueType === 'regular');
    const lateQueue = appointments.filter(apt => apt.queueType === 'late');

    res.json({
      success: true,
      data: {
        regular: regularQueue,
        late: lateQueue,
        total: appointments.length,
        waiting: appointments.filter(apt => apt.status === 'waiting').length,
        inProgress: appointments.filter(apt => apt.status === 'in-progress').length,
        completed: appointments.filter(apt => apt.status === 'completed').length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching doctor queue',
      error: error.message
    });
  }
};