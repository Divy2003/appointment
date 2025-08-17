import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:12000/api';

// Helper function to make API calls
async function apiCall(method, endpoint, data = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };
  
  if (data) {
    options.body = JSON.stringify(data);
  }
  
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('API call failed:', error);
    return null;
  }
}

async function testAPI() {
  console.log('🏥 Testing Doctor Appointment System API\n');
  
  // 1. Health check
  console.log('1. Health Check');
  const health = await apiCall('GET', '/health');
  console.log('✅ Server is running:', health.message);
  console.log('');
  
  // 2. Get all doctors
  console.log('2. Get All Doctors');
  const doctors = await apiCall('GET', '/doctors');
  console.log(`✅ Found ${doctors.data.length} doctors`);
  const doctorId = doctors.data[0]._id;
  console.log(`📋 Using Dr. ${doctors.data[0].name} (${doctors.data[0].specialization})`);
  console.log('');
  
  // 3. Create appointment
  console.log('3. Create New Appointment');
  const appointmentData = {
    patientData: {
      name: 'Alice Johnson',
      phone: '+1-555-9999',
      email: 'alice.johnson@email.com',
      age: 42,
      gender: 'Female'
    },
    doctorId: doctorId,
    reason: 'Annual physical examination',
    registrationMethod: 'website'
  };
  
  const newAppointment = await apiCall('POST', '/appointments', appointmentData);
  console.log(`✅ Appointment created with queue number: ${newAppointment.data.appointment.queueNumber}`);
  const appointmentId = newAppointment.data.appointment._id;
  console.log('');
  
  // 4. Get doctor's queue
  console.log('4. Get Doctor\'s Queue');
  const queue = await apiCall('GET', `/doctors/${doctorId}/queue`);
  console.log(`✅ Queue status: ${queue.data.total} total, ${queue.data.waiting} waiting, ${queue.data.inProgress} in progress`);
  console.log('');
  
  // 5. Update appointment status
  console.log('5. Update Appointment Status');
  const statusUpdate = await apiCall('PUT', `/appointments/${appointmentId}/status`, {
    status: 'in-progress',
    notes: 'Patient examination started'
  });
  console.log('✅ Appointment status updated to in-progress');
  console.log('');
  
  // 6. Create another appointment and move to late queue
  console.log('6. Create Another Appointment and Move to Late Queue');
  const lateAppointmentData = {
    patientData: {
      name: 'Bob Wilson',
      phone: '+1-555-8888',
      email: 'bob.wilson@email.com',
      age: 55,
      gender: 'Male'
    },
    doctorId: doctorId,
    reason: 'Follow-up consultation',
    registrationMethod: 'qr-code'
  };
  
  const lateAppointment = await apiCall('POST', '/appointments', lateAppointmentData);
  const lateAppointmentId = lateAppointment.data.appointment._id;
  
  // Move to late queue
  await apiCall('PUT', `/appointments/${lateAppointmentId}/late`);
  console.log('✅ Second appointment created and moved to late queue');
  console.log('');
  
  // 7. Get updated queue
  console.log('7. Get Updated Queue');
  const updatedQueue = await apiCall('GET', `/doctors/${doctorId}/queue`);
  console.log(`✅ Updated queue: ${updatedQueue.data.regular.length} in regular queue, ${updatedQueue.data.late.length} in late queue`);
  console.log('');
  
  // 8. Complete first appointment
  console.log('8. Complete First Appointment');
  await apiCall('PUT', `/appointments/${appointmentId}/status`, {
    status: 'completed',
    notes: 'Examination completed successfully'
  });
  console.log('✅ First appointment marked as completed');
  console.log('');
  
  // 9. Get final queue status
  console.log('9. Final Queue Status');
  const finalQueue = await apiCall('GET', `/doctors/${doctorId}/queue`);
  console.log(`✅ Final status: ${finalQueue.data.completed} completed, ${finalQueue.data.late.length} in late queue`);
  console.log('');
  
  console.log('🎉 All API tests completed successfully!');
}

// Run the test
testAPI().catch(console.error);