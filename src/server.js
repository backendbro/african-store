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
const Wishlist = require("./routes/WishList");
const BestSeller = require("./routes/BestSeller");
const Review = require("./routes/Review");
const Like = require("./routes/Like");

const main = async () => {
  const allowedOrigins = [
    "http://127.0.0.1:5500",
    "http://127.0.0.1:5501",
    "https://african-store-client.vercel.app",
  ];
  const app = express();
  app.use(
    cors({
      origin:{

      function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
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
  app.use("/api/v1/wishlist", Wishlist);
  app.use("/api/v1/bestseller", BestSeller);
  app.use("/api/v1/review", Review);
  app.use("/api/v1/like", Like);

  const port = process.env.port || 8000;
  const server = app.listen(port, () => {
    console.log(`server running on localhost:${port}`);
  });

  process.on("unhandledRejection", (err) => {
    if (err) {
      console.log(err);
    }

    server.close(() => process.exit(1));
  });
};

main().catch((error) => {
  console.log(error);
});
