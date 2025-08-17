# Doctor Appointment System - API Documentation

## Base URL
```
http://localhost:12000/api
```

## Endpoints

### Health Check
- **GET** `/health`
- **Description**: Check if the server is running
- **Response**: 
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2025-08-17T11:55:56.840Z"
}
```

### Doctors

#### Get All Doctors
- **GET** `/doctors`
- **Description**: Get all active doctors
- **Response**: List of doctors with their details

#### Get Doctor by ID
- **GET** `/doctors/:id`
- **Description**: Get specific doctor details
- **Parameters**: `id` - Doctor ID

#### Create Doctor
- **POST** `/doctors`
- **Description**: Create a new doctor
- **Body**:
```json
{
  "name": "Dr. John Smith",
  "specialization": "Cardiology",
  "email": "john.smith@hospital.com",
  "phone": "+1-555-0123",
  "workingHours": {
    "start": "09:00",
    "end": "17:00"
  },
  "workingDays": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  "averageConsultationTime": 20
}
```

#### Update Doctor
- **PUT** `/doctors/:id`
- **Description**: Update doctor information
- **Parameters**: `id` - Doctor ID
- **Body**: Same as create doctor

#### Get Doctor's Queue
- **GET** `/doctors/:doctorId/queue`
- **Description**: Get doctor's current queue (regular and late)
- **Parameters**: `doctorId` - Doctor ID
- **Response**:
```json
{
  "success": true,
  "data": {
    "regular": [...],
    "late": [...],
    "total": 2,
    "waiting": 1,
    "inProgress": 1,
    "completed": 0
  }
}
```

### Appointments

#### Create Appointment
- **POST** `/appointments`
- **Description**: Create a new appointment
- **Body**:
```json
{
  "patientData": {
    "name": "John Doe",
    "phone": "+1-555-1234",
    "email": "john.doe@email.com",
    "age": 35,
    "gender": "Male",
    "address": "123 Main St",
    "emergencyContact": {
      "name": "Jane Doe",
      "phone": "+1-555-5678",
      "relation": "Spouse"
    }
  },
  "doctorId": "doctor_id_here",
  "reason": "Regular checkup",
  "registrationMethod": "website"
}
```
- **Response**: Appointment details with QR code

#### Get Appointment by QR Code
- **GET** `/appointments/qr/:qrCode`
- **Description**: Get appointment details using QR code
- **Parameters**: `qrCode` - QR code data

#### Update Appointment Status
- **PUT** `/appointments/:appointmentId/status`
- **Description**: Update appointment status (waiting, in-progress, completed, cancelled)
- **Parameters**: `appointmentId` - Appointment ID
- **Body**:
```json
{
  "status": "in-progress",
  "notes": "Patient is being examined"
}
```

#### Move to Late Queue
- **PUT** `/appointments/:appointmentId/late`
- **Description**: Move appointment to late queue
- **Parameters**: `appointmentId` - Appointment ID

#### Get Patient's Appointments
- **GET** `/appointments/patient/:phone`
- **Description**: Get all appointments for a patient
- **Parameters**: `phone` - Patient's phone number

#### Get Appointment Statistics
- **GET** `/appointments/stats/:doctorId`
- **Description**: Get appointment statistics for a doctor
- **Parameters**: `doctorId` - Doctor ID

## Socket.IO Events

### Client to Server Events
- `joinDoctorRoom` - Join doctor's room for real-time updates
- `leaveDoctorRoom` - Leave doctor's room

### Server to Client Events
- `newAppointment` - Emitted when new appointment is created
- `appointmentUpdated` - Emitted when appointment status is updated
- `appointmentMovedToLate` - Emitted when appointment is moved to late queue

## Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error

## Queue System
The system supports two types of queues:
1. **Regular Queue**: Normal appointments in chronological order
2. **Late Queue**: Patients who are late or need to be rescheduled

## Appointment Statuses
- `waiting` - Patient is waiting in queue
- `in-progress` - Patient is currently being examined
- `completed` - Appointment is finished
- `cancelled` - Appointment was cancelled
- `late` - Patient is in the late queue