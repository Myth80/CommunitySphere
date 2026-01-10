const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");

dotenv.config();

const app = express();

/* DATABASE CONNECTION  */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

/* MIDDLEWARE */
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
const taskRoutes = require("./routes/taskRoutes"); 

app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes); 

app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

/*  SERVER */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
