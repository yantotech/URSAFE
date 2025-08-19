const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const authRoutes = require("./routes/auth");
const cctvRoutes = require("./routes/cctv");
const reportRoutes = require("./routes/report");
// const profileRoutes = require("./routes/profile");

app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"]
  }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/cctv", cctvRoutes);
app.use("/api/report", reportRoutes);
// app.use("/api/profile", profileRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
