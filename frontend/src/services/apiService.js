import api from '../utils/api';

export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/update-profile', data),
};

export const patientService = {
  register: (data) => api.post('/patients/register', data),
  getMyProfile: () => api.get('/patients/profile/me'),
  getPatient: (id) => api.get(`/patients/${id}`),
  updatePatient: (id, data) => api.put(`/patients/${id}`, data),
  searchPatients: (query) => api.get(`/patients/search?query=${query}`),
  getAllPatients: () => api.get('/patients'),
};

export const doctorService = {
  register: (data) => api.post('/doctors/register', data),
  getMyProfile: () => api.get('/doctors/profile/me'),
  getDoctor: (id) => api.get(`/doctors/${id}`),
  getAllDoctors: () => api.get('/doctors'),
  updateDoctor: (id, data) => api.put(`/doctors/${id}`, data),
};

export const appointmentService = {
  book: (data) => api.post('/appointments', data),
  getMyAppointments: () => api.get('/appointments/my-appointments'),
  getAppointment: (id) => api.get(`/appointments/${id}`),
  update: (id, data) => api.put(`/appointments/${id}`, data),
  cancel: (id) => api.delete(`/appointments/${id}`),
  getAllAppointments: () => api.get('/appointments/all'),
};

export const medicalRecordService = {
  create: (data) => api.post('/medical-records', data),
  getMyRecords: () => api.get('/medical-records/my-records'),
  getPatientRecords: (patientId) => api.get(`/medical-records/patient/${patientId}`),
  getRecord: (id) => api.get(`/medical-records/${id}`),
};

export const prescriptionService = {
  create: (data) => api.post('/prescriptions', data),
  getMyPrescriptions: () => api.get('/prescriptions/my-prescriptions'),
  getPatientPrescriptions: (patientId) => api.get(`/prescriptions/patient/${patientId}`),
  download: (id) => api.get(`/prescriptions/download/${id}`),
};

export const billService = {
  create: (data) => api.post('/bills', data),
  getMyBills: () => api.get('/bills/my-bills'),
  getBill: (id) => api.get(`/bills/${id}`),
  getPatientBills: (patientId) => api.get(`/bills/patient/${patientId}`),
  recordPayment: (id, data) => api.put(`/bills/${id}/pay`, data),
  getAllBills: () => api.get('/bills/all'),
  getServiceCatalog: () => api.get('/bills/services'),
  submitServicePayment: (data) => api.post('/bills/service-payment', data),
  verifyPayment: (id, data) => api.put(`/bills/${id}/verify`, data),
};

export const adminService = {
  getDashboardStats: () => api.get('/admin/dashboard'),
  getAllUsers: () => api.get('/admin/users'),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  updateUserStatus: (id, data) => api.put(`/admin/users/${id}`, data),
  getReports: () => api.get('/admin/reports'),
  verifyDoctor: (id, data) => api.put(`/admin/doctors/${id}/verify`, data),
};
