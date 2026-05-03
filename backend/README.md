# HCMS Backend - README

## Quick Start

### Prerequisites
- Node.js v14+
- MongoDB running locally

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   - Edit `.env` file
   - Ensure MongoDB URI is correct
   - Set a strong JWT secret

3. **Start server:**
   ```bash
   npm run dev
   ```

Server runs on `http://localhost:5000`

## Project Structure

```
src/
├── models/          # MongoDB schemas
├── controllers/     # Business logic
├── routes/         # API endpoints  
├── middleware/     # Auth & validation
├── utils/          # Helper functions
├── config/         # Database config
└── index.js        # Entry point
```

## Environment Variables

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hcms
JWT_SECRET=your_secret_key
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

## Available Commands

- `npm run dev` - Start with nodemon
- `npm start` - Start production server

## API Health Check

```bash
GET http://localhost:5000/api/health
```

Should return:
```json
{
  "message": "HCMS Backend is running"
}
```

## Troubleshooting

**MongoDB Connection Error:**
- Check if MongoDB is running
- Verify connection string in `.env`

**Port 5000 already in use:**
```bash
# Kill process on port 5000 (Windows)
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

## Database Reset

To reset the database:
```bash
# Delete HCMS database in MongoDB
# Use MongoDB Compass or mongosh
```

Refer to main README.md for complete API documentation.
