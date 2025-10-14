const dotenv = require('dotenv');
const express = require("express");
const cors = require("cors");
const path = require("path");
const { connect } = require('http2');
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const incomeRoutes = require("./routes/incomeRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");


const app = express();
dotenv.config();

app.use(cors({
    origin: process.env.CLIENT_URL || '*',
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["content-Type", "Authorization"]
}))

app.use(express.json());

connectDB(); 

app.use("/api/v1/auth",authRoutes);
app.use("/api/v1/income",incomeRoutes);
app.use("/api/v1/expense",expenseRoutes);
app.use("/api/v1/dashboard",dashboardRoutes);


// Serve frontend static files in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '..', 'Frontend', 'dist')));

    app.get('/*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '..', 'Frontend', 'dist', 'index.html'));
    });
}

app.use("/uploads", express.static(path.join(__dirname,"uploads")));


const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log(`app is listining on ${PORT}`));