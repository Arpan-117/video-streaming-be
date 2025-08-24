import mongoose from "mongoose";

const connectDB = async() => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log("Database connection successful...");
    } catch (err) {
        console.error("Database connection failed...");
        process.exit(1);
    }
}

export default connectDB;