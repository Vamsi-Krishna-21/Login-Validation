require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const authMiddleware = require("./middleware/authMiddleware");

const app = express();

// 🔗 Connect to MongoDB
connectDB();

// 🛡️ Middleware
app.use(cors({
  origin: "*"
}));

app.use(express.json());

// 📍 Routes
app.use("/api/auth", authRoutes);

// 🔐 Protected Route (Test JWT)
app.get("/api/dashboard", authMiddleware, (req, res) => {
  res.json({
    success: true,
    message: `Welcome to ${req.user.name}'s Dashboard 🚀`,
    userId: req.user.id
  });
});

// 🏠 Default Route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// ❌ Handle Unknown Routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

// 🚀 Start Server
// 🚀 Start Server

const PORT = process.env.PORT || 5000;

app.listen(

  PORT,

  "0.0.0.0",

  () => {

    console.log(`Server running on port ${PORT}`);

  }

);

console.log(process.env.EMAIL_USER);