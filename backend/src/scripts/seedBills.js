const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

const User = require('../models/User');
const Patient = require('../models/Patient');
const Bill = require('../models/Bill');

const seedBills = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hcms');
    console.log('Connected to MongoDB');

    // Find the patient user
    const patientUser = await User.findOne({ email: 'patient@hcms.com' });
    if (!patientUser) {
      console.error('Patient user not found! Run the main seed script first.');
      process.exit(1);
    }

    const patient = await Patient.findOne({ userId: patientUser._id });
    if (!patient) {
      console.error('Patient profile not found! Run the main seed script first.');
      process.exit(1);
    }

    // Check if bills already exist
    const existingBills = await Bill.countDocuments({ patientId: patient._id });
    if (existingBills > 0) {
      console.log(`${existingBills} bills already exist for this patient. Skipping seeding.`);
      await mongoose.connection.close();
      process.exit(0);
    }

    // Create fake bills
    const bills = [
      {
        patientId: patient._id,
        billNumber: 'BILL-2026-001',
        billDate: new Date('2026-04-10'),
        dueDate: new Date('2026-05-10'),
        items: [
          { description: 'General Consultation', quantity: 1, unitPrice: 50, total: 50 },
          { description: 'Blood Test (CBC)', quantity: 1, unitPrice: 35, total: 35 },
          { description: 'ECG Test', quantity: 1, unitPrice: 75, total: 75 },
        ],
        subtotal: 160,
        tax: 16,
        totalAmount: 176,
        paidAmount: 176,
        paymentStatus: 'Paid',
        paymentDate: new Date('2026-04-12'),
        notes: 'Annual checkup - fully paid',
      },
      {
        patientId: patient._id,
        billNumber: 'BILL-2026-002',
        billDate: new Date('2026-04-22'),
        dueDate: new Date('2026-05-22'),
        items: [
          { description: 'Cardiology Consultation', quantity: 1, unitPrice: 100, total: 100 },
          { description: 'Echocardiogram', quantity: 1, unitPrice: 250, total: 250 },
          { description: 'Stress Test', quantity: 1, unitPrice: 200, total: 200 },
        ],
        subtotal: 550,
        tax: 55,
        totalAmount: 605,
        paidAmount: 300,
        paymentStatus: 'Partial',
        paymentDate: new Date('2026-04-25'),
        notes: 'Cardiology follow-up - partial payment received',
      },
      {
        patientId: patient._id,
        billNumber: 'BILL-2026-003',
        billDate: new Date('2026-05-01'),
        dueDate: new Date('2026-06-01'),
        items: [
          { description: 'Follow-up Consultation', quantity: 1, unitPrice: 50, total: 50 },
          { description: 'Prescription Medications', quantity: 3, unitPrice: 25, total: 75 },
        ],
        subtotal: 125,
        tax: 12.5,
        totalAmount: 137.5,
        paidAmount: 0,
        paymentStatus: 'Unpaid',
        notes: 'Follow-up visit - payment pending',
      },
      {
        patientId: patient._id,
        billNumber: 'BILL-2026-004',
        billDate: new Date('2026-05-05'),
        dueDate: new Date('2026-06-05'),
        items: [
          { description: 'Dermatology Consultation', quantity: 1, unitPrice: 80, total: 80 },
          { description: 'Skin Biopsy', quantity: 1, unitPrice: 150, total: 150 },
          { description: 'Lab Analysis', quantity: 1, unitPrice: 100, total: 100 },
          { description: 'Topical Medication', quantity: 2, unitPrice: 30, total: 60 },
        ],
        subtotal: 390,
        tax: 39,
        totalAmount: 429,
        paidAmount: 429,
        paymentStatus: 'Paid',
        paymentDate: new Date('2026-05-05'),
        notes: 'Dermatology visit - paid at checkout',
      },
      {
        patientId: patient._id,
        billNumber: 'BILL-2026-005',
        billDate: new Date('2026-05-07'),
        dueDate: new Date('2026-06-07'),
        items: [
          { description: 'Emergency Room Visit', quantity: 1, unitPrice: 300, total: 300 },
          { description: 'X-Ray (Chest)', quantity: 1, unitPrice: 120, total: 120 },
          { description: 'IV Fluids & Medication', quantity: 1, unitPrice: 85, total: 85 },
          { description: 'Nursing Care (2 hrs)', quantity: 2, unitPrice: 50, total: 100 },
        ],
        subtotal: 605,
        tax: 60.5,
        totalAmount: 665.5,
        paidAmount: 0,
        paymentStatus: 'Unpaid',
        notes: 'Emergency visit - insurance claim pending',
      },
    ];

    await Bill.insertMany(bills);

    console.log('\n✅ Successfully seeded 5 bills!');
    console.log('-----------------------------------');
    console.log('BILL-2026-001  |  $176.00   |  Paid');
    console.log('BILL-2026-002  |  $605.00   |  Partial ($300 paid)');
    console.log('BILL-2026-003  |  $137.50   |  Unpaid');
    console.log('BILL-2026-004  |  $429.00   |  Paid');
    console.log('BILL-2026-005  |  $665.50   |  Unpaid');
    console.log('-----------------------------------');
    console.log('Login as patient@hcms.com / patient123 to view them.');
    console.log('Login as admin@hcms.com / admin123 to manage them.');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding bills:', error.message);
    process.exit(1);
  }
};

seedBills();
