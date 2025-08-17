# Doctor Appointment System - Backend API

## Features

- **Patient Registration**: Users can register without login using website or QR code
- **Doctor Management**: CRUD operations for doctors
- **Queue Management**: Real-time queue system with regular and late queues
- **Real-time Updates**: Socket.IO integration for live dashboard updates
- **QR Code Generation**: Automatic QR code generation for appointments

## API Endpoints

### Doctors
- `GET /api/doctors` - Get all active doctors
- `GET /api/doctors/:id` - Get doctor by ID
- `POST /api/doctors` - Create new doctor
- `PUT /api/doctors/:id` - Update doctor
- `GET /api/doctors/:doctorId/queue` - Get doctor's queue

### Appointments
- `POST /api/appointments` - Create new appointment
- `GET /api/appointments/qr/:qrCode` - Get appointment by QR code
- `PUT /api/appointments/:appointmentId/status` - Update appointment status
- `PUT /api/appointments/:appointmentId/late` - Move to late queue
- `GET /api/appointments/patient/:phone` - Get patient's appointments
- `GET /api/appointments/stats/:doctorId` - Get appointment statistics

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables in `.env`:
   ```
   PORT=12000
   MONGODB_URI=mongodb://localhost:27017/appointment_system
   NODE_ENV=development
   FRONTEND_URL=https://work-2-emvrioryblzlowme.prod-runtime.all-hands.dev
   ```

3. Seed the database with sample doctors:
   ```bash
   node seed.js
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

## Socket.IO Events

### Client to Server
- `joinDoctorRoom` - Join doctor's room for real-time updates
- `leaveDoctorRoom` - Leave doctor's room

### Server to Client
- `newAppointment` - New appointment created
- `appointmentUpdated` - Appointment status updated
- `appointmentMovedToLate` - Appointment moved to late queue

## Queue System

The system supports two types of queues:
1. **Regular Queue**: Normal appointments in order
2. **Late Queue**: Patients who are late or need to be rescheduled

Doctors can:
- Mark appointments as complete
- Cancel appointments
- Move patients to late queue
- View real-time queue status