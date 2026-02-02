const mongoose = require ('mongoose');

// Connect to MongoDB
const connectDB = async()=>{
    await mongoose.connect("mongodb+srv://pallavbharti:devTinder@cluster0.xwzdlxd.mongodb.net/devTinder");
    };


module.exports= connectDB;