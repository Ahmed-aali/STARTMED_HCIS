const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

const User = require('../models/User');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');

const seedDatabase = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hcms');
    console.log('Connected to MongoDB');

    const adminExists = await User.findOne({ email: 'admin@hcms.com' });
    const doctorExists = await User.findOne({ email: 'doctor@hcms.com' });
    const patientExists = await User.findOne({ email: 'patient@hcms.com' });

    if (adminExists && doctorExists && patientExists) {
      console.log('Demo accounts already exist. Skipping seeding.');
      await mongoose.connection.close();
      return;
    }

    if (!adminExists) {
      await User.create({
        email: 'admin@hcms.com',
        password: 'admin123',
        firstName: 'Admin',
        lastName: 'User',
        phone: '1234567890',
        role: 'admin',
        isActive: true,
      });
      console.log('Admin user created: admin@hcms.com');
    }

    if (!doctorExists) {
      const doctorUser = await User.create({
        email: 'doctor@hcms.com',
        password: 'doctor123',
        firstName: 'John',
        lastName: 'Doe',
        phone: '9876543210',
        role: 'doctor',
        isActive: true,
      });

      await Doctor.create({
        userId: doctorUser._id,
        specialization: 'Cardiology',
        licenseNumber: 'LIC123456',
        experience: 10,
        qualifications: ['MD', 'Board Certified'],
        hospital: 'City Medical Center',
        consultationFee: 50,
        isVerified: true,
      });
      console.log('Doctor user created: doctor@hcms.com');
    }

    if (!patientExists) {
      const patientUser = await User.create({
        email: 'patient@hcms.com',
        password: 'patient123',
        firstName: 'Jane',
        lastName: 'Smith',
        phone: '5555555555',
        role: 'patient',
        isActive: true,
      });

      await Patient.create({
        userId: patientUser._id,
        dateOfBirth: new Date('1990-05-15'),
        gender: 'Female',
        bloodGroup: 'O+',
        address: '123 Main Street',
        city: 'Springfield',
        state: 'IL',
        zipCode: '62701',
        allergies: ['Penicillin'],
        currentMedications: [],
        emergencyContact: {
          name: 'John Smith',
          phone: '5555555556',
          relation: 'Brother',
        },
      });
      console.log('Patient user created: patient@hcms.com');
    }

    console.log('\nDatabase seeding completed successfully!');
    console.log('\nDemo Accounts:');
    console.log('- Admin: admin@hcms.com / admin123');
    console.log('- Doctor: doctor@hcms.com / doctor123');
    console.log('- Patient: patient@hcms.com / patient123');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error.message);
    process.exit(1);
  }
};

seedDatabase();
