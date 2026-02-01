const mongoose = require('mongoose');

// Define User Schema
const userSchema = new mongoose.Schema({
    firstName: { type: String},
    lastName: { type: String},
    email: { type: String},
    password: { type: String },
});
module.exports = mongoose.model("User",userSchema);
