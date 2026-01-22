const express = require('express');
const app = express();
app.get('/',(req,res)=>{
    res.send("hello world");
});
app.get('/profile',(req,res)=>{
    res.send("Welcome to your profile page");
});
app.get('/test',(req,res)=>{
    res.send("No test cases are assigned yet");
});
app.get('/contact',(req,res)=>{
    res.send("contact us at");
});
app.listen(7777,()=>{
    console.log("Server is running on port 7777");
});