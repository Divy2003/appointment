import { useState } from 'react';
import { appointmentAPI } from '../services/api';

const AppointmentStatus = () => {
  const [searchType, setSearchType] = useState('phone');
  const [searchValue, setSearchValue] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchValue.trim()) return;

    setLoading(true);
    setError('');
    setAppointments([]);

    try {
      let response;
      if (searchType === 'phone') {
        response = await appointmentAPI.getPatientAppointments(searchValue);
        setAppointments(response.data.data);
      } else if (searchType === 'qr') {
        response = await appointmentAPI.getAppointmentByQR(searchValue);
        setAppointments([response.data.data]);
      }
    } catch (error) {
      console.error('Error searching appointments:', error);
      setError('No appointments found or invalid search criteria');
    } finally {
      setLoading(false);
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'waiting': return '⏳';
      case 'in-progress': return '👨‍⚕️';
      case 'completed': return '✅';
      case 'cancelled': return '❌';
      case 'late': return '⏰';
      default: return '📋';
    }
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getEstimatedWaitTime = (appointment) => {
    if (appointment.status !== 'waiting') return null;
    
    // Simple estimation based on queue position and average consultation time
    const avgTime = 20; // minutes
    const queuePosition = appointment.queueNumber;
    const estimatedMinutes = queuePosition * avgTime;
    
    if (estimatedMinutes < 60) {
      return `${estimatedMinutes} minutes`;
    } else {
      const hours = Math.floor(estimatedMinutes / 60);
      const minutes = estimatedMinutes % 60;
      return `${hours}h ${minutes}m`;
    }
  };

  return (
    <div className="appointment-status">
      <div className="container">
        <h2>🔍 Check Appointment Status</h2>
        
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-type-selector">
            <label>
              <input
                type="radio"
                value="phone"
                checked={searchType === 'phone'}
                onChange={(e) => setSearchType(e.target.value)}
              />
              Search by Phone Number
            </label>
            <label>
              <input
                type="radio"
                value="qr"
                checked={searchType === 'qr'}
                onChange={(e) => setSearchType(e.target.value)}
              />
              Search by QR Code
            </label>
          </div>

          <div className="search-input-group">
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder={
                searchType === 'phone' 
                  ? 'Enter phone number (e.g., +1-555-1234)' 
                  : 'Enter QR code data'
              }
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>

        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}

        {appointments.length > 0 && (
          <div className="appointments-results">
            <h3>📋 Your Appointments</h3>
            {appointments.map((appointment) => (
              <div key={appointment._id} className="appointment-status-card">
                <div className="status-header">
                  <div className="status-info">
                    <span className="status-icon">{getStatusIcon(appointment.status)}</span>
                    <span 
                      className="status-text"
                      style={{ color: getStatusColor(appointment.status) }}
                    >
                      {appointment.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="queue-info">
                    <span className="queue-number">Queue #{appointment.queueNumber}</span>
                    <span className="queue-type">{appointment.queueType} queue</span>
                  </div>
                </div>

                <div className="appointment-details">
                  <div className="detail-row">
                    <strong>Patient:</strong> {appointment.patient.name}
                  </div>
                  <div className="detail-row">
                    <strong>Doctor:</strong> {appointment.doctor?.name || 'Loading...'}
                  </div>
                  <div className="detail-row">
                    <strong>Reason:</strong> {appointment.reason}
                  </div>
                  <div className="detail-row">
                    <strong>Appointment Date:</strong> {formatDateTime(appointment.appointmentDate)}
                  </div>
                  {appointment.actualStartTime && (
                    <div className="detail-row">
                      <strong>Started At:</strong> {formatDateTime(appointment.actualStartTime)}
                    </div>
                  )}
                  {appointment.actualEndTime && (
                    <div className="detail-row">
                      <strong>Completed At:</strong> {formatDateTime(appointment.actualEndTime)}
                    </div>
                  )}
                  {appointment.notes && (
                    <div className="detail-row">
                      <strong>Notes:</strong> {appointment.notes}
                    </div>
                  )}
                </div>

                {appointment.status === 'waiting' && (
                  <div className="wait-time-info">
                    <div className="estimated-wait">
                      <strong>Estimated Wait Time:</strong> {getEstimatedWaitTime(appointment)}
                    </div>
                    <div className="wait-instructions">
                      <p>💡 <strong>Instructions:</strong></p>
                      <ul>
                        <li>Please arrive 15 minutes before your estimated time</li>
                        <li>Bring a valid ID and insurance card</li>
                        <li>If you're running late, please call the clinic</li>
                      </ul>
                    </div>
                  </div>
                )}

                {appointment.status === 'in-progress' && (
                  <div className="in-progress-info">
                    <p>🏥 <strong>Your consultation is currently in progress.</strong></p>
                    <p>Please wait for the doctor to complete the examination.</p>
                  </div>
                )}

                {appointment.status === 'completed' && (
                  <div className="completed-info">
                    <p>✅ <strong>Your appointment has been completed.</strong></p>
                    <p>Thank you for visiting. Please follow any instructions given by your doctor.</p>
                  </div>
                )}

                {appointment.status === 'late' && (
                  <div className="late-info">
                    <p>⏰ <strong>You have been moved to the late queue.</strong></p>
                    <p>Please check with the reception desk for your new estimated time.</p>
                  </div>
                )}

                {appointment.status === 'cancelled' && (
                  <div className="cancelled-info">
                    <p>❌ <strong>This appointment has been cancelled.</strong></p>
                    <p>Please contact the clinic to reschedule if needed.</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="help-section">
          <h3>❓ Need Help?</h3>
          <div className="help-content">
            <div className="help-item">
              <h4>📱 QR Code</h4>
              <p>Use the QR code from your appointment confirmation to quickly check your status.</p>
            </div>
            <div className="help-item">
              <h4>📞 Phone Number</h4>
              <p>Enter the phone number you used during registration to see all your appointments.</p>
            </div>
            <div className="help-item">
              <h4>🏥 Contact Clinic</h4>
              <p>For urgent matters or questions, please call the clinic directly.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentStatus;