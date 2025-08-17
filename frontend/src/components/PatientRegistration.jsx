import { useState, useEffect } from 'react';
import { doctorAPI, appointmentAPI } from '../services/api';

const PatientRegistration = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [appointment, setAppointment] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    age: '',
    gender: 'Male',
    address: '',
    doctorId: '',
    reason: '',
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  const setMockDoctors = () => {
    const mockDoctors = [
      { _id: 'doc1', name: 'Dr. John Doe', specialization: 'Cardiologist', workingHours: { start: '09:00', end: '17:00' }, averageConsultationTime: 15 },
      { _id: 'doc2', name: 'Dr. Jane Smith', specialization: 'Dermatologist', workingHours: { start: '10:00', end: '18:00' }, averageConsultationTime: 20 },
    ];
    setDoctors(mockDoctors);
  };

  const fetchDoctors = async () => {
    try {
      const response = await doctorAPI.getAllDoctors();
      if (response.data.data && response.data.data.length > 0) {
        setDoctors(response.data.data);
      } else {
        console.log("No doctors found from API, using mock data.");
        setMockDoctors();
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
      console.log("Error fetching doctors, using mock data.");
      setMockDoctors();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const appointmentData = {
        patientData: {
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          age: parseInt(formData.age),
          gender: formData.gender,
          address: formData.address
        },
        doctorId: formData.doctorId,
        reason: formData.reason,
      };

      const response = await appointmentAPI.createAppointment(appointmentData);
      setAppointment(response.data.data);
      
      // Reset form
      setFormData({
        name: '',
        phone: '',
        email: '',
        age: '',
        gender: 'Male',
        address: '',
        doctorId: '',
        reason: '',
      });
    } catch (error) {
      console.error('Error creating appointment:', error);
      alert('Error creating appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const selectedDoctor = doctors.find(doc => doc._id === formData.doctorId);

  return (
    <div className="patient-registration">
      <div className="container">
        <h2>📝 Patient Registration</h2>
        
        {!appointment ? (
          <form onSubmit={handleSubmit} className="registration-form">
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="age">Age *</label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  min="1"
                  max="120"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="gender">Gender *</label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="address">Address</label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                rows="2"
              />
            </div>

            <div className="form-group">
              <label htmlFor="doctorId">Select Doctor *</label>
              <select
                id="doctorId"
                name="doctorId"
                value={formData.doctorId}
                onChange={handleInputChange}
                required
              >
                <option value="">Choose a doctor...</option>
                {doctors.map(doctor => (
                  <option key={doctor._id} value={doctor._id}>
                    {doctor.name} - {doctor.specialization}
                  </option>
                ))}
              </select>
            </div>

            {selectedDoctor && (
              <div className="doctor-info">
                <h4>👨‍⚕️ Doctor Information</h4>
                <p><strong>Name:</strong> {selectedDoctor.name}</p>
                <p><strong>Specialization:</strong> {selectedDoctor.specialization}</p>
                <p><strong>Working Hours:</strong> {selectedDoctor.workingHours.start} - {selectedDoctor.workingHours.end}</p>
                <p><strong>Average Consultation Time:</strong> {selectedDoctor.averageConsultationTime} minutes</p>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="reason">Reason for Visit *</label>
              <textarea
                id="reason"
                name="reason"
                value={formData.reason}
                onChange={handleInputChange}
                rows="3"
                required
              />
            </div>

            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? 'Creating Appointment...' : 'Book Appointment'}
            </button>
          </form>
        ) : (
          <div className="appointment-success">
            <h3>✅ Appointment Booked Successfully!</h3>
            <div className="appointment-details">
              <div className="details-section">
                <h4>📋 Appointment Details</h4>
                <p><strong>Queue Number:</strong> {appointment.appointment.queueNumber}</p>
                <p><strong>Patient:</strong> {appointment.appointment.patient.name}</p>
                <p><strong>Doctor:</strong> {appointment.appointment.doctor.name}</p>
                <p><strong>Specialization:</strong> {appointment.appointment.doctor.specialization}</p>
                <p><strong>Status:</strong> {appointment.appointment.status}</p>
                <p><strong>Reason:</strong> {appointment.appointment.reason}</p>
                <p><strong>Date:</strong> {new Date(appointment.appointment.appointmentDate).toLocaleString()}</p>
              </div>
            </div>
            
            <button 
              onClick={() => setAppointment(null)} 
              className="new-appointment-btn"
            >
              Book Another Appointment
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientRegistration;