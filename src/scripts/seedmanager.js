require('dotenv').config({ path: '../../.env' });

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const seedManager = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        // ken thama manager deja created, console t5arej message "Manager already exists" 
        const existingManager = await User.findOne({ role: 'manager' });

        if (existingManager) {
            console.log('Manager already exists');
            return;
        }

        const hashedPassword = await bcrypt.hash('manager123', 10);

console.log('Database:', mongoose.connection.name);
console.log('Users count:', await User.countDocuments());

        const manager = await User.create({
            nom: '1st manager',
            login: '1st_manager',
            password: hashedPassword,
            role: 'manager'
        });

        console.log('Manager created successfully',manager);

    } catch (error) {
        console.error(error);
    } finally {
        await mongoose.disconnect();
    }
};

seedManager();