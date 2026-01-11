const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();

// ✅ CORS (THIS WAS MISSING)
app.use(
  cors({
    origin: ["http://localhost:5173",
             "https://communitysphere-frontend.onrender.com"],
    credentials: true
  })
);

// middleware
app.use(express.json());

// test route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

// routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

// database + server start
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
