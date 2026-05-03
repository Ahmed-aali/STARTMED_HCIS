# Start Med - Healthcare Management System Complete Guide

## Project Overview

**Start Med** is a professional healthcare management system built with:
- **Frontend:** React.js (Modern UI, Responsive Design)
- **Backend:** Node.js + Express.js (RESTful API)
- **Database:** MongoDB (Document-based)
- **Authentication:** JWT (JSON Web Tokens)

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

## 📞 Support

For issues or questions:
1. Check troubleshooting section above
2. Review backend logs in terminal
3. Check browser console (F12)
4. Verify all environment variables are correct

---

## 📄 License

This is a school project for educational purposes.

---

## 👥 Team

Built with ❤️ as a complete MERN stack healthcare solution.

---

**Happy coding! 🚀**
