const mongoose = require("mongoose");

const connectDb = async () => {
  const conn = await mongoose.connect(
    "mongodb+srv://nzubechukwuukagha:_sMM3F68SE3R5QD@my-first-cluster.6ghwi37.mongodb.net/"
  );
  console.log(`mongodb connected: ${conn.connection.host}`);
};

module.exports = connectDb;
