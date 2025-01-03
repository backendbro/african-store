import mongoose from "mongoose";

export const connectDb = async() => {
    const conn = await mongoose.connect(process.env.mongodb_url || "")
    console.log(`mongodb connected: ${conn.connection.host}`)
}

