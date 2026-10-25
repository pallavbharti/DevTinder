require("dotenv").config();
require("./utils/cronjob");

const express = require('express');

const connectDB = require('./config/database');
const cors = require('cors');
const cookieParser = require("cookie-parser");
const allowedOrigins = require("./config/allowedOrigins");

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

const app = express();
app.disable("x-powered-by");
app.set("trust proxy", 1);

const {initializeSocket}= require("./utils/socket");
const http = require("http");
const server = http.createServer(app);
initializeSocket(server);
const chatRouter = require("./routes/chat");


app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", chatRouter);


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
  const PORT = process.env.PORT || 7777;

  server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  });
}).catch((err) => {
  console.error("Database connection failed", err);
});