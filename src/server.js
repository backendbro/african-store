const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connectDb = require("./db/database");

const Auth = require("./routes/Auth");
const Category = require("./routes/Category");
const Product = require("./routes/Product");
const Payment = require("./routes/Payment");

const main = async () => {
  const app = express();
  app.use(
    cors({
      // origin: [
      //   "http://127.0.0.1:5500",
      //   "https://african-store-client.vercel.app",
      // ], // Explicitly allow your frontend origin
      origin: "http://127.0.0.1:5500",
      methods: "GET,POST,PUT,DELETE",
      allowedHeaders: ["Content-Type", "Authorization"], // Use an array for headers
      credentials: true, // Optional: Allow cookies/authentication headers
    })
  );

  // Handle OPTIONS requests
  app.options("*", cors());
  app.use(express.json());
  app.use(cookieParser());

  connectDb();

  app.use("/api/v1/auth", Auth);
  app.use("/api/v1/category", Category);
  app.use("/api/v1/product", Product);
  app.use("/api/v1/payment", Payment);

  const port = process.env.port;
  const server = app.listen(port, () => {
    console.log(`server running on localhost:${port}`);
  });
};

main().catch((error) => {
  console.log(error);
});
