const mongoose = require("mongoose");

const connectDB = async () => {
    const connect = await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");
};

module.exports = connectDB;