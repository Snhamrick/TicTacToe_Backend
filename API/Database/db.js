const mongoose = require('mongoose');
require('../Models/Users');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_STRING, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        });
        console.log("Database Connected");
    }
    catch(err) {
        console.log("Database Failed to Connect " + err.message);
    }
}

module.exports = connectDB;