const express = require('express');
const app = express();

app.get('/a/',(req,res)=>{
    res.send({name:"John Doe", age:30});
});
app.get('/user',(req,res)=>{
    console.log(req.query);
    res.send({name:"John Doe", age:30});
});


app.get("/user/:id/:password/:age",(req,res)=>{
    console.log(req.params);
    res.send("User created");
});

app.post('/user',(req,res)=>{
    res.send("User created");
});
app.delete('/user',(req,res)=>{
    res.send("User deleted");
})
app.use('/',(req,res)=>{
    res.send("hello world");
});
app.listen(7777,()=>{
    console.log("Server is running on port 7777");
});