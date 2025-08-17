# 🏥 Doctor Appointment System

A comprehensive web application for managing doctor appointments with real-time queue management, built with React, Node.js, and MongoDB.

## ✨ Features

### For Patients
- **Easy Registration**: Register for appointments via website or QR code
- **Doctor Selection**: Choose from available doctors with specializations
- **QR Code Generation**: Get a unique QR code for each appointment
- **Real-time Status**: Check appointment status anytime
- **Queue Information**: See estimated wait times and queue position

### For Doctors
- **Real-time Dashboard**: Live updates of patient queue
- **Queue Management**: Separate regular and late queues
- **Patient Actions**: Start consultation, complete, cancel, or move to late queue
- **Patient Information**: View patient details and appointment reasons
- **Statistics**: Track completed, waiting, and in-progress appointments

### System Features
- **Real-time Updates**: Socket.IO for live dashboard updates
- **Queue System**: Automatic queue number assignment
- **Late Queue Management**: Handle late patients separately
- **Mobile Responsive**: Works on all devices
- **Professional UI**: Clean, modern interface

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd appointment
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   
   # Start MongoDB (if not running)
   mongod --dbpath /tmp/mongodb --bind_ip 127.0.0.1 --port 27017 &
   
   # Seed sample data
   node seed.js
   
   # Start backend server
   npm start
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   
   # Start frontend development server
   npm run dev
   ```

4. **Access the Application**
   - Frontend: http://localhost:12001
   - Backend API: http://localhost:12000

## 📱 Usage

### Patient Registration
1. Go to the homepage
2. Fill in patient details
3. Select a doctor
4. Provide reason for visit
5. Get QR code and queue number

### Doctor Dashboard
1. Navigate to "Doctor Dashboard"
2. Select a doctor from dropdown
3. View real-time queue status
4. Manage appointments:
   - Start consultation
   - Complete appointment
   - Cancel appointment
   - Move to late queue

### Check Status
1. Go to "Check Status"
2. Search by phone number or QR code
3. View appointment details and estimated wait time

## 🏗️ Architecture

### Backend (Node.js + Express)
```
backend/
├── models/          # MongoDB schemas
├── controllers/     # Business logic
├── routes/          # API endpoints
├── config/          # Database configuration
├── server.js        # Main server file
└── seed.js          # Sample data seeder
```

### Frontend (React + Vite)
```
frontend/
├── src/
│   ├── components/  # React components
│   ├── services/    # API service layer
│   ├── App.jsx      # Main app component
│   └── main.jsx     # Entry point
└── public/          # Static assets
```

## 🔌 API Endpoints

### Doctors
- `GET /api/doctors` - Get all doctors
- `GET /api/doctors/:id` - Get doctor by ID
- `GET /api/doctors/:doctorId/queue` - Get doctor's queue

### Appointments
- `POST /api/appointments` - Create appointment
- `GET /api/appointments/qr/:qrCode` - Get appointment by QR code
- `PUT /api/appointments/:id/status` - Update appointment status
- `PUT /api/appointments/:id/late` - Move to late queue
- `GET /api/appointments/patient/:phone` - Get patient's appointments

## 🔄 Real-time Features

The system uses Socket.IO for real-time updates:
- New appointment notifications
- Status change updates
- Queue position changes
- Live dashboard updates

## 📊 Queue Management

### Regular Queue
- Patients are assigned sequential queue numbers
- FIFO (First In, First Out) processing
- Real-time status updates

### Late Queue
- Separate queue for late patients
- Doctors can move patients between queues
- Maintains original queue numbers

## 🎨 UI/UX Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Professional Styling**: Clean, medical-themed interface
- **Real-time Updates**: Live status changes without refresh
- **Intuitive Navigation**: Easy-to-use interface for all users
- **Status Indicators**: Color-coded status badges
- **QR Code Integration**: Easy appointment tracking

## 🔧 Configuration

### Environment Variables
Create `.env` files in both backend and frontend directories:

**Backend (.env)**
```
PORT=12000
MONGODB_URI=mongodb://localhost:27017/appointment_system
NODE_ENV=development
FRONTEND_URL=http://localhost:12001
```

**Frontend (.env)**
```
VITE_API_URL=http://localhost:12000/api
```

## 🧪 Testing

### Backend Testing
```bash
cd backend
node test-api.js
```

### Manual Testing
1. Create appointments via frontend
2. Test doctor dashboard functionality
3. Verify real-time updates
4. Test QR code functionality
5. Check mobile responsiveness

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB on production server
2. Configure environment variables
3. Install dependencies: `npm install --production`
4. Start with PM2: `pm2 start server.js`

### Frontend Deployment
1. Build production version: `npm run build`
2. Serve static files with nginx or similar
3. Configure API endpoints for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support or questions:
- Check the API documentation in `backend/API_DOCUMENTATION.md`
- Review the code comments
- Create an issue in the repository

## 🔮 Future Enhancements

- [ ] SMS notifications
- [ ] Email confirmations
- [ ] Payment integration
- [ ] Multi-language support
- [ ] Advanced analytics
- [ ] Appointment scheduling
- [ ] Doctor availability calendar
- [ ] Patient history tracking