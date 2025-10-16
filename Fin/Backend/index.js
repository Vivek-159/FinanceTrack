const dotenv = require('dotenv');
dotenv.config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const incomeRoutes = require("./routes/incomeRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const passport = require('passport');
require('./config/passport-setup');


const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL || '*',
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["content-Type", "Authorization"]
}))

app.use(express.json());

// Initialize Passport (stateless, no sessions)
app.use(passport.initialize());

connectDB(); 

app.use("/api/v1/auth",authRoutes);
// Alias to support Google OAuth callbacks without /api prefix
app.use("/auth", authRoutes);
app.use("/api/v1/income",incomeRoutes);
app.use("/api/v1/expense",expenseRoutes);
app.use("/api/v1/dashboard",dashboardRoutes);

app.use("/uploads", express.static(path.join(__dirname,"uploads")));


const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log(`app is listining on ${PORT}`));