require("dotenv").config();

const express = require('express');
const connectDB = require('./config/database');
const cors = require('cors');
const cookieParser = require("cookie-parser");

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

app.get("/", (req, res) => {
  try {
    res.send("Backend Server is running...🚀");
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).send("Internal Server Error");
  }
});
connectDB().then(() => {
  console.log("Database connected successfully");
  app.listen(7777, () => {
    console.log("Server is running on port 7777");
  });
}).catch((err) => {
  console.error("Database connection failed", err);
});