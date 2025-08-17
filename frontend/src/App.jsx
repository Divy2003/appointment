import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import PatientRegistration from './components/PatientRegistration';
import DoctorDashboard from './components/DoctorDashboard';
import AppointmentStatus from './components/AppointmentStatus';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="nav-container">
            <h1 className="nav-title">🏥 Doctor Appointment System</h1>
            <div className="nav-links">
              <Link to="/" className="nav-link">Patient Registration</Link>
              <Link to="/doctor" className="nav-link">Doctor Dashboard</Link>
              <Link to="/status" className="nav-link">Check Status</Link>
            </div>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<PatientRegistration />} />
            <Route path="/doctor" element={<DoctorDashboard />} />
            <Route path="/status" element={<AppointmentStatus />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
