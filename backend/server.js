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

/*  preflight requests */
app.options("*", cors());

app.use(express.json());

/* Health check */
app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
