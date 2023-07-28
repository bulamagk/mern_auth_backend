const express = require("express");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

const usersRoutes = require("./routes/usersRoutes");
const authRoutes = require("./routes/authRoutes");
const { notFound, errorHanlder } = require("./middlewares/errorMiddleware");

const PORT = process.env.PORT || 5000;

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/", authRoutes);
app.use("/api/users", usersRoutes);

// Welcome Route
app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to MERN CRUD" });
});

// Error Middleware
app.use(notFound), app.use(errorHanlder);

mongoose.connect(process.env.DB_URI).then(() => {
  app.listen(PORT, () => console.log(`App is listening on port ${PORT}`));
});
