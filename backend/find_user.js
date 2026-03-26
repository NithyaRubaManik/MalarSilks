const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const findUser = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const user = await User.findOne({ email: 'jamunadevig.23aim@kongu.edu' });
        if (user) {
            console.log('User found in DB:', user.email);
        } else {
            console.log('USER DOES NOT EXIST IN DATABASE');
        }
        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

findUser();
