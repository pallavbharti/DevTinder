const express = require("express");
const profileRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
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
profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    // Middleware se user already mil chuka hai
    const user = req.user;

    res.send(user);

  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});
module.exports = profileRouter;