import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { doctorAPI, appointmentAPI } from '../services/api';

const DoctorDashboard = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [queue, setQueue] = useState({ regular: [], late: [], total: 0, waiting: 0, inProgress: 0, completed: 0 });
  const [loading, setLoading] = useState(false);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    fetchDoctors();
    
    // Initialize socket connection
    const newSocket = io('http://localhost:12000');
    setSocket(newSocket);

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (selectedDoctor && socket) {
      // Join doctor's room for real-time updates
      socket.emit('joinDoctorRoom', selectedDoctor);
      
      // Listen for real-time updates
      socket.on('newAppointment', (data) => {
        if (data.doctorId === selectedDoctor) {
          fetchQueue();
        }
      });

      socket.on('appointmentUpdated', (data) => {
        if (data.doctorId === selectedDoctor) {
          fetchQueue();
        }
      });

      socket.on('appointmentMovedToLate', (data) => {
        if (data.doctorId === selectedDoctor) {
          fetchQueue();
        }
      });

      fetchQueue();

      return () => {
        socket.emit('leaveDoctorRoom', selectedDoctor);
        socket.off('newAppointment');
        socket.off('appointmentUpdated');
        socket.off('appointmentMovedToLate');
      };
    }
  }, [selectedDoctor, socket]);

  const fetchDoctors = async () => {
    try {
      const response = await doctorAPI.getAllDoctors();
      setDoctors(response.data.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const fetchQueue = async () => {
    if (!selectedDoctor) return;
    
    setLoading(true);
    try {
      const response = await doctorAPI.getDoctorQueue(selectedDoctor);
      setQueue(response.data.data);
    } catch (error) {
      console.error('Error fetching queue:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (appointmentId, status, notes = '') => {
    try {
      await appointmentAPI.updateAppointmentStatus(appointmentId, { status, notes });
      fetchQueue(); // Refresh queue
    } catch (error) {
      console.error('Error updating appointment status:', error);
      alert('Error updating appointment status');
    }
  };

  const moveToLateQueue = async (appointmentId) => {
    try {
      await appointmentAPI.moveToLateQueue(appointmentId);
      fetchQueue(); // Refresh queue
    } catch (error) {
      console.error('Error moving to late queue:', error);
      alert('Error moving appointment to late queue');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'waiting': return '#ffa500';
      case 'in-progress': return '#007bff';
      case 'completed': return '#28a745';
      case 'cancelled': return '#dc3545';
      case 'late': return '#6f42c1';
      default: return '#6c757d';
    }
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString();
  };

  const selectedDoctorInfo = doctors.find(doc => doc._id === selectedDoctor);

  return (
    <div className="doctor-dashboard">
      <div className="container">
        <h2>👨‍⚕️ Doctor Dashboard</h2>
        
        <div className="doctor-selector">
          <label htmlFor="doctorSelect">Select Doctor:</label>
          <select
            id="doctorSelect"
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
          >
            <option value="">Choose a doctor...</option>
            {doctors.map(doctor => (
              <option key={doctor._id} value={doctor._id}>
                {doctor.name} - {doctor.specialization}
              </option>
            ))}
          </select>
        </div>

        {selectedDoctorInfo && (
          <div className="doctor-info-card">
            <h3>{selectedDoctorInfo.name}</h3>
            <p><strong>Specialization:</strong> {selectedDoctorInfo.specialization}</p>
            <p><strong>Working Hours:</strong> {selectedDoctorInfo.workingHours.start} - {selectedDoctorInfo.workingHours.end}</p>
            <p><strong>Average Consultation:</strong> {selectedDoctorInfo.averageConsultationTime} minutes</p>
          </div>
        )}

        {selectedDoctor && (
          <div className="queue-dashboard">
            <div className="queue-stats">
              <div className="stat-card">
                <h4>Total Patients</h4>
                <span className="stat-number">{queue.total}</span>
              </div>
              <div className="stat-card">
                <h4>Waiting</h4>
                <span className="stat-number" style={{color: '#ffa500'}}>{queue.waiting}</span>
              </div>
              <div className="stat-card">
                <h4>In Progress</h4>
                <span className="stat-number" style={{color: '#007bff'}}>{queue.inProgress}</span>
              </div>
              <div className="stat-card">
                <h4>Completed</h4>
                <span className="stat-number" style={{color: '#28a745'}}>{queue.completed}</span>
              </div>
            </div>

            <div className="queues-container">
              {/* Regular Queue */}
              <div className="queue-section">
                <h3>📋 Regular Queue ({queue.regular.length})</h3>
                {queue.regular.length === 0 ? (
                  <p className="empty-queue">No patients in regular queue</p>
                ) : (
                  <div className="appointments-list">
                    {queue.regular.map((appointment) => (
                      <div key={appointment._id} className="appointment-card">
                        <div className="appointment-header">
                          <span className="queue-number">#{appointment.queueNumber}</span>
                          <span 
                            className="status-badge"
                            style={{ backgroundColor: getStatusColor(appointment.status) }}
                          >
                            {appointment.status}
                          </span>
                        </div>
                        
                        <div className="patient-info">
                          <h4>{appointment.patient.name}</h4>
                          <p><strong>Age:</strong> {appointment.patient.age} | <strong>Gender:</strong> {appointment.patient.gender}</p>
                          <p><strong>Phone:</strong> {appointment.patient.phone}</p>
                          <p><strong>Reason:</strong> {appointment.reason}</p>
                          <p><strong>Registered:</strong> {formatTime(appointment.createdAt)}</p>
                          {appointment.actualStartTime && (
                            <p><strong>Started:</strong> {formatTime(appointment.actualStartTime)}</p>
                          )}
                        </div>

                        <div className="appointment-actions">
                          {appointment.status === 'waiting' && (
                            <>
                              <button 
                                onClick={() => updateAppointmentStatus(appointment._id, 'in-progress')}
                                className="btn btn-primary"
                              >
                                Start Consultation
                              </button>
                              <button 
                                onClick={() => moveToLateQueue(appointment._id)}
                                className="btn btn-warning"
                              >
                                Move to Late
                              </button>
                              <button 
                                onClick={() => updateAppointmentStatus(appointment._id, 'cancelled')}
                                className="btn btn-danger"
                              >
                                Cancel
                              </button>
                            </>
                          )}
                          
                          {appointment.status === 'in-progress' && (
                            <button 
                              onClick={() => updateAppointmentStatus(appointment._id, 'completed', 'Consultation completed')}
                              className="btn btn-success"
                            >
                              Complete
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Late Queue */}
              <div className="queue-section">
                <h3>⏰ Late Queue ({queue.late.length})</h3>
                {queue.late.length === 0 ? (
                  <p className="empty-queue">No patients in late queue</p>
                ) : (
                  <div className="appointments-list">
                    {queue.late.map((appointment) => (
                      <div key={appointment._id} className="appointment-card late-appointment">
                        <div className="appointment-header">
                          <span className="queue-number">#{appointment.queueNumber}</span>
                          <span 
                            className="status-badge"
                            style={{ backgroundColor: getStatusColor(appointment.status) }}
                          >
                            {appointment.status}
                          </span>
                        </div>
                        
                        <div className="patient-info">
                          <h4>{appointment.patient.name}</h4>
                          <p><strong>Age:</strong> {appointment.patient.age} | <strong>Gender:</strong> {appointment.patient.gender}</p>
                          <p><strong>Phone:</strong> {appointment.patient.phone}</p>
                          <p><strong>Reason:</strong> {appointment.reason}</p>
                          <p><strong>Original Time:</strong> {formatTime(appointment.createdAt)}</p>
                        </div>

                        <div className="appointment-actions">
                          <button 
                            onClick={() => updateAppointmentStatus(appointment._id, 'in-progress')}
                            className="btn btn-primary"
                          >
                            Start Consultation
                          </button>
                          <button 
                            onClick={() => updateAppointmentStatus(appointment._id, 'cancelled')}
                            className="btn btn-danger"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;