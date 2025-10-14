const mongoose = require('mongoose');

const connectDB = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {});
        console.log("DB connecte Successfully..!")
    } catch (error) {
        console.error("error accure",error);
        process.exit(1);
    }
};

module.exports = connectDB;