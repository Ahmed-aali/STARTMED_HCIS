# HCMS Frontend - README

## Quick Start

### Prerequisites
- Node.js v14+
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm start
   ```

App runs on `http://localhost:3000`

## Project Structure

```
src/
├── components/     # Reusable components
├── pages/         # Page components
├── context/       # Auth context
├── services/      # API calls
├── utils/         # Helper functions
├── styles/        # CSS files
├── App.js         # Main component
└── index.js       # Entry point
```

## Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from create-react-app

## Environment Variables

```
REACT_APP_API_URL=http://localhost:5000
```

## Pages

### Public
- `/login` - Login page
- `/register` - Registration page

### Patient Routes
- `/patient` - Patient dashboard
- `/patient/book-appointment` - Book appointment
- `/patient/appointments` - My appointments
- `/patient/medical-records` - View records
- `/patient/prescriptions` - View prescriptions
- `/patient/bills` - Billing information

### Doctor Routes
- `/doctor` - Doctor dashboard
- `/doctor/appointments` - Manage appointments
- `/doctor/medical-records` - Add medical records
- `/doctor/prescriptions` - Create prescriptions

### Admin Routes
- `/admin` - Admin dashboard
- `/admin/users` - Manage users
- `/admin/reports` - View reports
- `/admin/bills` - Manage bills

## Components

### Core Components
- `Navbar` - Top navigation bar
- `Sidebar` - Side navigation menu
- `ProtectedRoute` - Route protection
- `LoadingSpinner` - Loading indicator
- `Alert` - Alert messages
- `Chatbot` - FAQ chatbot

## Features

✅ Responsive design
✅ JWT authentication
✅ Role-based access
✅ Real-time form validation
✅ Rule-based chatbot
✅ Clean UI with cards & tables

## Troubleshooting

**Blank page:**
- Check if backend is running on port 5000
- Check browser console (F12)
- Clear cache and refresh

**API errors:**
- Ensure backend is running
- Check network tab in DevTools
- Verify JWT token in localStorage

**Port 3000 already in use:**
```bash
# Kill process on port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

## Chatbot Features

The chatbot can answer questions about:
- How to book appointments
- How to view medical records
- How to pay bills
- How to view prescriptions
- And more...

Type 'help' in chatbot for full list.

Refer to main README.md for complete project documentation.
