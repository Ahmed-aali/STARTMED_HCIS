require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/database');
const { errorMiddleware } = require('./utils/errorHandler');

// Connect to database
connectDB();

const app = express();
const server = http.createServer(app);

// Socket.IO for WebRTC signaling
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/patients', require('./routes/patientRoutes'));
app.use('/api/doctors', require('./routes/doctorRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/medical-records', require('./routes/medicalRecordRoutes'));
app.use('/api/prescriptions', require('./routes/prescriptionRoutes'));
app.use('/api/bills', require('./routes/billRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'HCMS Backend is running' });
});

// ==============================
// WebRTC Signaling via Socket.IO
// ==============================
const rooms = {}; // { roomId: { users: [{ socketId, userId, userName, role }] } }

io.on('connection', (socket) => {
  console.log(`🔌 Socket connected: ${socket.id}`);

  // User joins a consultation room
  socket.on('join-room', ({ roomId, userId, userName, role }) => {
    socket.join(roomId);

    if (!rooms[roomId]) {
      rooms[roomId] = { users: [] };
    }

    // Remove existing entry for this user (reconnection case)
    rooms[roomId].users = rooms[roomId].users.filter(u => u.userId !== userId);
    rooms[roomId].users.push({ socketId: socket.id, userId, userName, role });

    console.log(`👤 ${userName} (${role}) joined room: ${roomId}`);

    // Notify other users in the room
    socket.to(roomId).emit('user-joined', {
      socketId: socket.id,
      userId,
      userName,
      role,
    });

    // Send current users in the room to the joiner
    const otherUsers = rooms[roomId].users.filter(u => u.socketId !== socket.id);
    socket.emit('room-users', otherUsers);
  });

  // WebRTC Signaling: relay offer
  socket.on('offer', ({ to, offer }) => {
    io.to(to).emit('offer', { from: socket.id, offer });
  });

  // WebRTC Signaling: relay answer
  socket.on('answer', ({ to, answer }) => {
    io.to(to).emit('answer', { from: socket.id, answer });
  });

  // WebRTC Signaling: relay ICE candidate
  socket.on('ice-candidate', ({ to, candidate }) => {
    io.to(to).emit('ice-candidate', { from: socket.id, candidate });
  });

  // Chat message in the room
  socket.on('chat-message', ({ roomId, message, userName }) => {
    socket.to(roomId).emit('chat-message', { message, userName, timestamp: new Date() });
  });

  // User leaves the room
  socket.on('leave-room', ({ roomId }) => {
    handleLeaveRoom(socket, roomId);
  });

  // Disconnection
  socket.on('disconnect', () => {
    console.log(`❌ Socket disconnected: ${socket.id}`);
    // Remove user from all rooms
    for (const roomId of Object.keys(rooms)) {
      handleLeaveRoom(socket, roomId);
    }
  });
});

function handleLeaveRoom(socket, roomId) {
  if (rooms[roomId]) {
    const user = rooms[roomId].users.find(u => u.socketId === socket.id);
    rooms[roomId].users = rooms[roomId].users.filter(u => u.socketId !== socket.id);

    if (user) {
      socket.to(roomId).emit('user-left', {
        socketId: socket.id,
        userName: user.userName,
      });
      console.log(`👋 ${user.userName} left room: ${roomId}`);
    }

    // Clean up empty rooms
    if (rooms[roomId].users.length === 0) {
      delete rooms[roomId];
    }
  }
  socket.leave(roomId);
}

// Error handling middleware
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
