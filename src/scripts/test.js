//lfile hetha l objectif mte3ou ntesti bih creation mta3 user 
// ma8ir post request bch ntesti l database connection

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
require('dotenv').config({ path: '../../.env' });

const createTestUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const existingUser = await User.findOne({ login: 'testuser' });

    if (existingUser) {
      console.log('Test user already exists');
      return;
    }

    const hashedPassword = await bcrypt.hash('Test123!', 10);

    await User.create({
      nom: 'Test User',
      login: 'testuser',
      password: hashedPassword,
      role: 'user'
    });

    console.log('Test user created successfully');
    console.log('Login: testuser');
    console.log('Password: Test123!');
  } catch (error) {
    console.error('Error creating test user:', error);
  } finally {
    await mongoose.disconnect();
  }
};

createTestUser();
