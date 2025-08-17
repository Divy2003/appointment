import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  appointmentDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  queueNumber: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['waiting', 'in-progress', 'completed', 'cancelled', 'late'],
    default: 'waiting'
  },
  queueType: {
    type: String,
    enum: ['regular', 'late', 'completed', 'cancelled'],
    default: 'regular'
  },
  reason: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  },
  estimatedTime: {
    type: Date
  },
  actualStartTime: {
    type: Date
  },
  actualEndTime: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for efficient querying
appointmentSchema.index({ doctor: 1, appointmentDate: 1, queueNumber: 1 });
appointmentSchema.index({ status: 1 });

export default mongoose.model('Appointment', appointmentSchema);