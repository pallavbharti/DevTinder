const mongoose = require('mongoose');
const validator = require("validator");

// Define User Schema
const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String},

    emailId: {
    type: String,
    lowercase: true,
    required: true,
    unique: true,
    trim: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid email address: " + value);
      }
    }
  },
    password: { type: String,required: true },
    photoUrl : { type: String ,default: "https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-High-Quality-Image.png",
        validate(value) {
      if (!validator.isURL(value)) {
        throw new Error("Invalid PHOTO URL address: " + value);
      }
    }
    },
    about: { type: String , default: "Hello! I'm new to DevTinder. Looking forward to connecting with fellow developers!" },
    skills: { type: [String] },
    
    gender: {
  type: String,
  validate(value) {
    if (!["male", "female", "others"].includes(value)) {
      throw new Error("Gender data is not valid");
    }
  },
},
    
  },
  { timestamps: true }  
);
module.exports = mongoose.model("User",userSchema);
