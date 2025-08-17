import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Doctor from './models/Doctor.js';

dotenv.config();

const seedDoctors = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing doctors
    await Doctor.deleteMany({});

    // Sample doctors
    const doctors = [
      {
        name: 'Dr. Sarah Johnson',
        specialization: 'General Medicine',
        email: 'sarah.johnson@hospital.com',
        phone: '+1-555-0101',
        workingHours: { start: '09:00', end: '17:00' },
        workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        averageConsultationTime: 15
      },
      {
        name: 'Dr. Michael Chen',
        specialization: 'Cardiology',
        email: 'michael.chen@hospital.com',
        phone: '+1-555-0102',
        workingHours: { start: '08:00', end: '16:00' },
        workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        averageConsultationTime: 20
      },
      {
        name: 'Dr. Emily Rodriguez',
        specialization: 'Pediatrics',
        email: 'emily.rodriguez@hospital.com',
        phone: '+1-555-0103',
        workingHours: { start: '10:00', end: '18:00' },
        workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        averageConsultationTime: 25
      },
      {
        name: 'Dr. David Wilson',
        specialization: 'Orthopedics',
        email: 'david.wilson@hospital.com',
        phone: '+1-555-0104',
        workingHours: { start: '07:00', end: '15:00' },
        workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        averageConsultationTime: 30
      },
      {
        name: 'Dr. Lisa Thompson',
        specialization: 'Dermatology',
        email: 'lisa.thompson@hospital.com',
        phone: '+1-555-0105',
        workingHours: { start: '11:00', end: '19:00' },
        workingDays: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        averageConsultationTime: 20
      }
    ];

    await Doctor.insertMany(doctors);
    console.log('Sample doctors created successfully');

    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDoctors();