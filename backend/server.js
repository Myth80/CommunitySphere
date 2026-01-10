const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();

/*  CORS  */
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://communitysphere-frontend.onrender.com"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));


app.use(express.json());
const authRoutes = require("./routes/auth");

app.use("/auth", authRoutes);

/* Health check */
app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
