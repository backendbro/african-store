const mongoose = require("mongoose");

const connectDb = async () => {
  const conn = await mongoose.connect(process.env.mongodb_url);
  console.log(`mongodb connected: ${conn.connection.host}`);
};

module.exports = connectDb;
