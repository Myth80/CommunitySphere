const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose"); // ✅ MISSING LINE (THIS IS THE FIX)

dotenv.config();

const app = express();

/* ✅ CONNECT TO MONGODB */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

/* CORS */
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://communitysphere-frontend.onrender.com"
  ],
  credentials: true
}));

app.use(express.json());

/* ROUTES */
const authRoutes = require("./routes/authRoutes");
app.use("/auth", authRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
