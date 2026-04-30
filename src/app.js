const express = require('express');
const connectDB = require('./config/database');
const app = express();
exports.app = app;

const User = require('./models/user');
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
app.use(cookieParser());
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");

app.use(express.json());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

/*
Login
 ↓
JWT token create
 ↓
Cookie me store
 ↓
Profile hit
 ↓
Middleware run
 ↓
Token verify
 ↓
User fetch (findById)
 ↓
req.user set
 ↓
Route me use
*/

// GET /feed
app.get('/feed', async (req, res) => {
  try {
    const users = await User.find({});
    res.send({ users: users });
  } catch (err) {
    res.status(400).send({ message: "Error fetching users", error: err.message });
  }
});

// GET /user (FIXED)
// Query se email aayega: /user?email=test@gmail.com
app.get('/user', async (req, res) => {
  const userEmail = req.query.email;

  try {
    const user = await User.findOne({ emailId: userEmail });
    res.send(user);
  } catch (err) {
    res.status(400).json({ message: "error while fetching", error: err.message });
  }
});

// GET all users
app.get('/users', async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send({ message: "Users fetched successfully", users: users });
  } catch (err) {
    res.status(400).send({ message: "Error fetching users", error: err.message });
  }
});

// GET user by ID
app.get('/user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).send("User not found");

    res.send(user);

  } catch (err) {
    res.status(400).send("Invalid ID");
  }
});

// POST /user
// Direct user create (no validation)
app.post("/user", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    res.status(200).send("user added successfully");
  } catch (err) {
    res.status(400).send("Error adding user");
  }
});

// DELETE /user
app.delete("/user", async (req, res) => {
  const userId = req.body.id;

  try {
    await User.findByIdAndDelete(userId);
    res.send("User deleted successfully");
  } catch (err) {
    res.status(400).send("Error deleting user");
  }
});

// PATCH /user
// Update flow:
// ID lo → data lo → update karo → response
app.patch("/user", async (req, res) => {
  const userId = req.body.id;
  const data = req.body;

  try {
    await User.findByIdAndUpdate(userId, data, { returnDocument: "after" });
    res.send("User updated successfully");
  } catch (err) {
    res.status(400).send("Error updating user");
  }
});

// DB connect + server start
connectDB().then(() => {
  console.log("Database connected successfully");

  app.listen(7777, () => {
    console.log("Server is running on port 7777");
  });

}).catch((err) => {
  console.error("Database connection failed", err);
});