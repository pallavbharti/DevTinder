const express = require('express');
const connectDB = require('./config/database');
const app = express();
exports.app = app;
const User = require('./models/user');

app.use(express.json());
// app.get('/user', async (req,res)=>{
//     const userEmail = req.body.email;
//     try{
//         const users = await User.find({email:userEmail});
//         if(users.length === 0)
//         {
//             res.status(404).send({message: "User not found"});
//         }
//         else{
//             res.status(200).send({message:"User found", user:users});
//         }
//     }catch(err){
//         res.status(400).send({message:"Error fetching user", error:err.message});
//     }
// })
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
connectDB().then(()=>{
    console.log("Database connected successfully");
    app.listen(7777,()=>{
    console.log("Server is running on port 7777");
    });
})
.catch((err)=>{
    console.error("Database connection failed", err);
});