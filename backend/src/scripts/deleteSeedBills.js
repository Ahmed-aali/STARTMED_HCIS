const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

const Bill = require('../models/Bill');

const deleteSeedBills = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hcms');
    console.log('Connected to MongoDB');

    const result = await Bill.deleteMany({
      billNumber: { $in: ['BILL-2026-001', 'BILL-2026-002', 'BILL-2026-003', 'BILL-2026-004', 'BILL-2026-005'] }
    });

    console.log(`✅ Deleted ${result.deletedCount} seed bills.`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

deleteSeedBills();
