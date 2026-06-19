const express = require("express");
const requestRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest"); 
const User = require("../models/user");

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
  try {

    const fromUserId = req.user._id;

    const { status, toUserId } = req.params;

    const allowedStatus = ["ignored", "interested"];

    if (!allowedStatus.includes(status)) {
      return res.status(400).send("Invalid status",);
    }
    
    const toUser = await User.findById(toUserId);
    if (!toUser) {
      return res.status(404).json({ message: "User not found" });
    }


    const existingConnectionRequest = await ConnectionRequest.findOne({
  $or: [
    { fromUserId, toUserId },
    { fromUserId: toUserId, toUserId: fromUserId },
  ],
});

if (existingConnectionRequest) {
  return res
    .status(400)
    .send({ message: "Connection Request Already Exists!!" });
}
    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    });

    await connectionRequest.save();

    res.send("req.user._id: " + req.user._id + " toUserId: " + toUserId + " status: " + status);

  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});
requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
  try{
    const loggedInUserId = req.user; // here req.user = loggedinuser , toUserId 
    // check for status
    const {status,requestId} = req.params;
    const allowedStatus = ["accepted", "rejected"];
    if(!allowedStatus.includes(status)){
      return res.status(400).json({ message: "Invalid status" });
    }
    // check for connection request in db 
   const connectionRequest = await ConnectionRequest.findOne({
  _id: requestId,
  toUserId: loggedInUserId._id,
  status: "interested"
});

if (!connectionRequest) {
  return res.status(404).json({
    message: "Connection Request not found or already reviewed"
  });
}
    connectionRequest.status = status;
    const data =await connectionRequest.save();
    res.json({ message: "Connection Request " + status + " successfully", data });
  }catch(err){
    res.status(400).json({ message: "ERROR: " + err.message });
  }
});
module.exports = requestRouter;