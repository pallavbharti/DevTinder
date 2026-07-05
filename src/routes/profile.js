const express = require("express");
const profileRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");
const bcrypt = require("bcrypt"); 
/*
Client → request /profile
        ↓
Cookie automatically bheji jaati hai
        ↓
Middleware (userAuth) run hota hai
        ↓
JWT verify hota hai
        ↓
User fetch hota hai (req.user set hota hai)
        ↓
Route me directly user mil jata hai
*/

// GET /profile
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    // Middleware se user already mil chuka hai
    const user = req.user;

    res.send(user);

  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});
// 1. /profile/edit — user data wapas bhejo
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        validateEditProfileData(req);
        const loggedInUser = req.user;
        Object.keys(req.body).forEach((key) => {
            loggedInUser[key] = req.body[key];
        });
        await loggedInUser.save();

        
        res.json({ message: "Profile updated successfully", data: loggedInUser });

    } catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }
});

// 2. /profile/password — clean response
profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const { oldPassword, newPassword } = req.body;
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) throw new Error("Old password is incorrect");
    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    user.password = newPasswordHash;
    await user.save();

    
    res.json({ message: "Password updated successfully" });

  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});
module.exports = profileRouter;