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

app.use(express.json());
// POST /signup (Signup) – validation + sanitization: 
app.post("/signup", async (req,res)=>{

 try{

   validateSignUpData(req);

   const { firstName, lastName, emailId, password } = req.body;

   const passwordHash = await bcrypt.hash(password,10);

   const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash
   });

   await user.save();

   res.send("User Added Successfully");

 }catch(err){

   res.status(400).send("ERROR : " + err.message);

 }

})
// Post /Login (Login) – validation + sanitization:
app.post("/login",async(req,res)=>{
  try{
    const{emailId,password}=req.body;
    const user = await User.findOne({emailId:emailId});
    if(!user){
      throw new Error("Invalid credentials");
    }
    const ispasswordValid = await bcrypt.compare(password,user.password);
    if(!ispasswordValid){
      throw new Error("Invalid credentials");
    }
    res.send("Login successful");
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

app.get('/feed',async(req,res)=>{
    try{
        const users = await User.find({});
        res.send({users:users});
    }
    catch(err){
        res.status(400).send({message:"Error fetching users", error:err.message});
    }
});
app.get('/user',async(req,res)=>{
    const userEmail = req.body.email;
    try{
        console.log(userEmail);
        const user = await User.findOne({email:userEmail});
        res.send(user);
    }catch (err) {
        res.status(400).json({ message: "error while fetching", error: err.message });
        }
});
app.get('/users',async(req,res)=>{
    try{
    const users = await User.find({});
    res.status(200).send({message:"Users fetched successfully", users:users});
    }catch(err){
        res.status(400).send({message:"Error fetching users", error:err.message});
    }
});

app.get('/user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send("User not found");
    res.send(user);
  } catch (err) {
    res.status(400).send("Invalid ID");
  }
});


app.post("/user", async (req,res)=>{
    const user = new User(req.body);
    try{
        await user.save();
        res.status(200).send("user added successfully");

    }catch(err){
        res.status(400).send("Error adding user");
    }

})

app.delete("/user", async (req,res)=>{
    const userId = req.body.id;
    try{
        const user = await User.findByIdAndDelete(userId);
        res.send("User deleted successfully");
    }catch(err){
        res.status(400).send("Error deleting user");
    }
})
app.patch("/user",async(req,res)=>{
    const userId = req.body.id;
    const data = req.body;
    try{
        const user = await User.findByIdAndUpdate(userId,data,{returnDocument:"after"});
        console.log(user);
        res.send("User updated successfully");
    }catch(err){
        res.status(400).send("Error updating user");
    }
});

//  POST /user (Signup) – validation + sanitization
const { body, validationResult } = require("express-validator");

app.post(
  "/user",
  [
    body("name").trim().notEmpty(),
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send("Invalid input");
    }

    const user = new User(req.body);
    try {
      await user.save();
      res.status(200).send("user added successfully");
    } catch (err) {
      res.status(400).send("Error adding user");
    }
  }
);
app.post("/signup",async(req,res)=>{
  const user = new User(req.body);
  try{
    await user.save();
    res.status(200).send("user added successfully");
  }catch(err){
    res.status(400).send("error while saving nthe user", err.message);
  }
})
//  PATCH /user (Update) – API level validation
app.patch(
  "/user",
  [
    body("name").optional().trim().notEmpty(),
    body("email").optional().isEmail().normalizeEmail(),
    body("password").optional().isLength({ min: 6 }),
  ],
  async (req, res) => {
    const userId = req.body.id;
    const data = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send("Invalid input");
    }

    try {
      const user = await User.findByIdAndUpdate(userId, data, {
        returnDocument: "after",
      });
      res.send("User updated successfully");
    } catch (err) {
      res.status(400).send("Error updating user");
    }
  }
);
connectDB().then(()=>{
    console.log("Database connected successfully");
    app.listen(7777,()=>{
    console.log("Server is running on port 7777");
    });
})
.catch((err)=>{
    console.error("Database connection failed", err);
});