const express = require("express");
const requestRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
requestRouter.get("/sendConnectionRequest", userAuth, (req, res) => {
    const user = req.user;
    // Logic to send connection request
    console.log("Connection request sending...");
    res.send(user.firstName + "Connection request sent successfully");
});
module.exports = requestRouter;