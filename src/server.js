const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connectDb = require("./db/database");

const Auth = require("./routes/Auth");
const Category = require("./routes/Category");
const Product = require("./routes/Product");

// const main = async () => {
//   const app = express();
//   app.use(
//     cors({
//       origin: "http://127.0.0.1:5501",
//       methods: "GET,POST,PUT,DELETE",
//       allowedHeaders: ["Content-Type", "Authorization"],
//       credentials: true,
//     })
//   );

//   app.options("*", cors());
//   app.use(express.json());
//   app.use(cookieParser());

//   connectDb();

//   app.use((req, res, next) => {
//     if (req.originalUrl.startsWith("/api/v1/product/create")) {
//       // Skip JSON parsing for this route
//       next();
//     } else {
//       // Parse JSON for all other routes
//       express.json()(req, res, next);
//     }
//   });

//   app.use("/api/v1/auth", Auth);
//   app.use("/api/v1/category", Category);
//   app.use("/api/v1/product", Product);

//   const port = process.env.port;
//   const server = app.listen(port, () => {
//     console.log(`server running on localhost:${port}`);
//   });
// };

const main = async () => {
  const app = express();

  // 1. CORS setup first
  app.use(
    cors({
      origin: "http://127.0.0.1:5501",
      methods: "GET,POST,PUT,DELETE",
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    })
  );
  app.options("*", cors());

  // 2. Cookie parser (no JSON yet)
  app.use(cookieParser());

  // 3. Connect to DB
  connectDb();

  // 4. Middleware to conditionally apply express.json()
  app.use((req, res, next) => {
    if (req.originalUrl.startsWith("/api/v1/product/create")) {
      // Skip JSON parsing for file upload route
      next();
    } else {
      // Apply JSON parsing for all other routes
      express.json()(req, res, next);
    }
  });

  // 5. Routes
  app.use("/api/v1/auth", Auth);
  app.use("/api/v1/category", Category);
  app.use("/api/v1/product", Product);

  // Start server
  const port = process.env.port;
  const server = app.listen(port, () => {
    console.log(`server running on localhost:${port}`);
  });
};
main().catch((error) => {
  console.log(error);
});
