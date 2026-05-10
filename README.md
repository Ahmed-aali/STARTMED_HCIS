# Start Med - Healthcare Management System Complete Guide

## Project Overview

**Start Med** is a professional healthcare management system built with:
- **Frontend:** React.js (Modern Glassmorphic UI, Responsive Design)
- **Backend:** Node.js + Express.js (RESTful API)
- **Database:** MongoDB (Document-based)
- **Authentication:** JWT (JSON Web Tokens)
- **Real-Time Video:** WebRTC & Socket.io for Video Consultations

## 📸


💳 8. Patient Billing & Service Payment

<img width="1917" height="990" alt="Image" src="https://github.com/user-attachments/assets/88c25898-d200-41fe-b4ae-9abd896dc094" />

### 🧑‍💼 2. Patient Dashboard Overview
<img width="1919" height="992" alt="Image" src="https://github.com/user-attachments/assets/63f58e99-5aef-4d9d-a1f8-c177e2a93f94" />

👨‍⚕️ 10. Admin: Doctor Verification

<img width="1919" height="998" alt="Image" src="https://github.com/user-attachments/assets/79b9a1aa-799b-457f-b7c8-82b60b83db44" />

<img width="1919" height="995" alt="Image" src="https://github.com/user-attachments/assets/bfbfbf5c-db77-47ff-9fb9-6eba123ebb1d" />

📊 9. Admin Dashboard & Statistics
<img width="1919" height="996" alt="Image" src="https://github.com/user-attachments/assets/438d61fd-bcc2-452e-8425-b7e90a12d35c" />

### 📝 6. Interactive E-Prescription Form
<img width="1919" height="1001" alt="Image" src="https://github.com/user-attachments/assets/bd78032d-ea82-4b13-a1a9-5368372cc11a" />

### 📹 4. WebRTC Video Consultation Room
<img width="1919" height="997" alt="Image" src="https://github.com/user-attachments/assets/abff9a55-b973-445b-951e-0164d648db5c" />

### 💳 8. Patient Billing & Service Payment
<img width="1918" height="996" alt="Image" src="https://github.com/user-attachments/assets/56eba5cf-c38c-4c4a-b88b-9185c8436a59" />

### 📊 9. Admin Dashboard & Statistics
<img width="1918" height="1003" alt="Image" src="https://github.com/user-attachments/assets/abf91c8f-6bd5-4312-857f-a503f9b60f05" />

### 👨‍⚕️ 10. Admin: Doctor Verification
<img width="1919" height="986" alt="Image" src="https://github.com/user-attachments/assets/b9c2802e-e252-4cb7-9af1-a03bff5f89b9" />

### 💬 11. Intelligent Chatbot Assistant
<img width="1919" height="995" alt="Image" src="https://github.com/user-attachments/assets/9d297377-68f1-43f1-95c9-757490711b40" />

### ⚙️ 12. User Profile Management
<img width="1919" height="994" alt="Image" src="https://github.com/user-attachments/assets/c730633a-3709-4d31-a313-f25c4d9b6435" />


<img width="1919" height="1000" alt="Image" src="https://github.com/user-attachments/assets/e763e7a7-7262-4a5b-9bed-373483dd2979" />


<img width="1919" height="1004" alt="Image" src="https://github.com/user-attachments/assets/62b59f5a-1bcc-4cd6-bbb0-748e4bad4501" />


## Features

### Patient Portal
- ✅ Register & Login
- ✅ View/Edit Profile
- ✅ Book Appointments with Doctors
- ✅ View Medical History
- ✅ View Prescriptions
- ✅ Track Bills & Make Payments
- ✅ View Appointment Reminders

### Doctor Dashboard
- ✅ View & Manage Appointments
- ✅ Approve/Reject Appointments
- ✅ Add Medical Records
- ✅ Create Prescriptions
- ✅ Manage Patient Information

### Admin Dashboard
- ✅ Manage Users (Patients/Doctors)
- ✅ View System Statistics
- ✅ Manage Billing
- ✅ Generate Reports
- ✅ Monitor Appointments

### Bonus Features
- ✅ **WebRTC Video Consultations** (Custom Peer-to-Peer Video Calls & Screen Sharing)
- ✅ **Premium UI/UX** (Glassmorphism, Dynamic Gradients, Custom Animations)
- ✅ **Interactive Clinical Forms** (Symptom Tagging, Dynamic Patient Search)
- ✅ **AI-Free Chatbot** (Rule-based FAQs)
- ✅ Responsive Design
- ✅ Role-Based Access Control
- ✅ Secure JWT Authentication

---

## 📁 Project Structure

```
HCIS project/
│
├── backend/
│   ├── src/
│   │   ├── models/           # MongoDB schemas
│   │   ├── controllers/      # Business logic
│   │   ├── routes/          # API endpoints
│   │   ├── middleware/      # Auth & validation
│   │   ├── utils/           # Helper functions
│   │   ├── config/          # Database config
│   │   └── index.js         # Main entry point
│   ├── package.json
│   ├── .env
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── context/        # Auth context
│   │   ├── services/       # API services
│   │   ├── utils/          # Utilities
│   │   ├── styles/         # CSS files
│   │   ├── App.js          # Main app component
│   │   └── index.js        # React entry point
│   ├── public/             # Static files
│   ├── package.json
│   ├── .env
│   └── README.md
│
└── README.md               # This file
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js** (v14+) - [Download](https://nodejs.org/)
- **MongoDB** - [Setup Guide](https://docs.mongodb.com/manual/installation/)
- **npm** or **yarn**

### Step 1: Install MongoDB

**Windows:**
1. Download MongoDB from https://www.mongodb.com/try/download/community
2. Run the installer
3. Choose "Install as a Service"
4. MongoDB will start automatically

**Verify Installation:**
```bash
mongod --version
```

---

### Step 2: Setup Backend

1. **Navigate to backend folder:**
   ```bash
   cd "c:\Users\PC\Desktop\HCIS project\backend"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   - File: `backend/.env` (already created)
   - Check these values:
     ```
     PORT=5000
     MONGODB_URI=mongodb://localhost:27017/hcms
     JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
     NODE_ENV=development
     CORS_ORIGIN=http://localhost:3000
     ```

4. **Start backend server:**
   ```bash
   npm run dev
   ```
   
   You should see:
   ```
   Server running on port 5000
   MongoDB Connected: localhost
   ```

---

### Step 3: Setup Frontend

1. **Navigate to frontend folder (New Terminal):**
   ```bash
   cd "c:\Users\PC\Desktop\HCIS project\frontend"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Check .env file:**
   ```
   REACT_APP_API_URL=http://localhost:5000
   ```

4. **Start frontend:**
   ```bash
   npm start
   ```
   
   Browser will open at `http://localhost:3000`

---

## 🧪 Testing the Application

### Test User Accounts

**Admin:**
- Email: `admin@hcms.com`
- Password: `admin123`

**Doctor:**
- Email: `doctor@hcms.com`
- Password: `doctor123`

**Patient:**
- Email: `patient@hcms.com`
- Password: `patient123`

### Quick Test Workflow

1. **Register a new account:**
   - Click "Register"
   - Fill in details
   - Choose role (Patient/Doctor/Admin)
   - Click "Register"

2. **Login & Explore:**
   - Login with credentials
   - Explore dashboard
   - Try booking appointments (Patient)
   - Try managing appointments (Doctor)
   - Try viewing stats (Admin)

3. **Test Chatbot:**
   - Click 💬 button (bottom-right)
   - Ask questions like:
     - "How to book appointment?"
     - "How to view records?"
     - "How to pay bills?"

---

## 📊 API Endpoints Reference

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/update-profile` - Update profile

### Patients
- `POST /api/patients/register` - Complete patient registration
- `GET /api/patients/profile/me` - Get my profile
- `GET /api/patients/:id` - Get patient by ID
- `PUT /api/patients/:id` - Update patient
- `GET /api/patients/search` - Search patients
- `GET /api/patients` - Get all patients (Admin)

### Doctors
- `POST /api/doctors/register` - Complete doctor registration
- `GET /api/doctors/profile/me` - Get my profile
- `GET /api/doctors/:id` - Get doctor by ID
- `GET /api/doctors` - Get all doctors
- `PUT /api/doctors/:id` - Update doctor

### Appointments
- `POST /api/appointments` - Book appointment
- `GET /api/appointments/my-appointments` - Get my appointments
- `GET /api/appointments/:id` - Get appointment details
- `PUT /api/appointments/:id` - Update appointment status
- `DELETE /api/appointments/:id` - Cancel appointment
- `GET /api/appointments/all` - Get all appointments (Admin)

### Medical Records
- `POST /api/medical-records` - Create record
- `GET /api/medical-records/my-records` - Get my records (Patient)
- `GET /api/medical-records/patient/:patientId` - Get patient records
- `GET /api/medical-records/:id` - Get record by ID
- `PUT /api/medical-records/:id` - Update record

### Prescriptions
- `POST /api/prescriptions` - Create prescription
- `GET /api/prescriptions/my-prescriptions` - Get my prescriptions (Patient)
- `GET /api/prescriptions/patient/:patientId` - Get patient prescriptions
- `GET /api/prescriptions/:id` - Get prescription
- `PUT /api/prescriptions/:id` - Update prescription
- `GET /api/prescriptions/download/:id` - Download prescription

### Bills
- `POST /api/bills` - Create bill (Admin)
- `GET /api/bills/my-bills` - Get my bills (Patient)
- `GET /api/bills/:id` - Get bill details
- `GET /api/bills/patient/:patientId` - Get patient bills
- `PUT /api/bills/:id/pay` - Record payment
- `PUT /api/bills/:id` - Update bill
- `GET /api/bills` - Get all bills (Admin)

### Admin
- `GET /api/admin/dashboard` - Get dashboard stats
- `GET /api/admin/users` - Get all users
- `GET /api/admin/reports` - Generate reports
- `DELETE /api/admin/users/:id` - Delete user
- `PUT /api/admin/users/:id` - Update user status

---

## 🔐 Authentication & Authorization

### How JWT Works
1. User logs in with email & password
2. Backend validates credentials
3. Server generates JWT token
4. Token stored in localStorage
5. Token sent with every API request
6. Backend validates token before processing

### Roles & Permissions

| Action | Patient | Doctor | Admin |
|--------|---------|--------|-------|
| Book Appointment | ✅ | ❌ | ✅ |
| Manage Appointments | ✅ | ✅ | ✅ |
| View Medical Records | ✅ | ✅ | ✅ |
| Add Medical Records | ❌ | ✅ | ✅ |
| Create Prescriptions | ❌ | ✅ | ✅ |
| Manage Bills | ✅ | ❌ | ✅ |
| View Statistics | ❌ | ❌ | ✅ |
| Manage Users | ❌ | ❌ | ✅ |

---

## 🐛 Troubleshooting

### Issue: MongoDB Connection Error
**Solution:**
- Ensure MongoDB is running: `net start MongoDB` (Windows)
- Check connection string in `.env`
- Verify port 27017 is available

### Issue: Backend won't start
**Solution:**
```bash
# Clear node_modules and reinstall
rm -r node_modules
npm install
npm run dev
```

### Issue: Frontend blank page
**Solution:**
- Check browser console for errors
- Ensure backend is running on port 5000
- Clear browser cache (Ctrl+Shift+Delete)

### Issue: CORS Error
**Solution:**
- Check `CORS_ORIGIN` in backend `.env`
- Should be `http://localhost:3000`
- Restart backend after changes

---

## 📝 Database Models

### User
```javascript
{
  email, password, firstName, lastName,
  phone, role, profileImage, isActive
}
```

### Patient
```javascript
{
  userId, dateOfBirth, gender, bloodGroup,
  address, city, state, zipCode, allergies,
  currentMedications, emergencyContact
}
```

### Doctor
```javascript
{
  userId, specialization, licenseNumber, experience,
  qualifications, hospital, consultationFee, isVerified
}
```

### Appointment
```javascript
{
  patientId, doctorId, appointmentDate, appointmentTime,
  reason, status, consultationFee, reminder
}
```

### MedicalRecord
```javascript
{
  patientId, doctorId, visitDate, diagnosis,
  symptoms, treatmentPlan, vitals, labResults, followUpDate
}
```

### Prescription
```javascript
{
  patientId, doctorId, medicines, issuedDate,
  expiryDate, status
}
```

### Bill
```javascript
{
  patientId, billNumber, billDate, items,
  subtotal, tax, totalAmount, paymentStatus
}
```

---

## 🎯 Next Steps & Enhancements

1. **Email Notifications** - Send appointment reminders
2. **SMS Alerts** - Integrate Twilio for SMS
3. **Real Payment Gateway** - Integrate Stripe/PayPal
4. **Advanced Reporting** - Charts & graphs
5. **Video Consultations** - Integrate Zoom/Jitsi
6. **Mobile App** - React Native app
7. **AI Assistant** - Upgrade chatbot with real AI
8. **Analytics** - User behavior tracking

---


## 👥 HCIS Team2

Built with ❤️ as a complete MERN stack healthcare solution.

---
