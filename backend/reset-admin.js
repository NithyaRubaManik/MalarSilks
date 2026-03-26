const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const resetAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Delete existing admin
        await Admin.deleteOne({ email: 'admin@malarsilks.com' });
        console.log('Deleted old admin');

        // Create new admin
        await Admin.create({
            email: 'admin@malarsilks.com',
            password: 'admin123'
        });
        console.log('Created new admin with password: admin123');

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

resetAdmin();
