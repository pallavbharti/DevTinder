const express = require('express');
const connectDB = require('./config/database');
const app = express();

const User = require('./models/user');


app.post('/signup',async(req,res)=>{
    // Signup logic here
    const user = new User({
    firstName:"virat",
    lastName: "kohli",
    email: "virat@kohli.com",
    password: "virat123",
   });
    await user.save();
    res.send("User signed up successfully");
});

connectDB().then(()=>{
    console.log("Database connected successfully");
    app.listen(7777,()=>{
    console.log("Server is running on port 7777");
    });
})
.catch((err)=>{
    console.error("Database connection failed", err);
});