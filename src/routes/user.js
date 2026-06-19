const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const USER_SAFE_DATA = "firstName lastName ";
userRouter.get("/user/requests/recieves",userAuth,async (req,res)=>{
    try {
        const loggedInUser = req.user;
        const connectionRequests =  await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status:"interested"
        }).populate("fromUserId",USER_SAFE_DATA);
        res.status(200).json({ message: "Connection Requests fetched successfully", data: connectionRequests });
    }catch (error) {
        res.status(500).json({ error: error.message });
    }
});
userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { toUserId: loggedInUser._id, status: "accepted" },
                { fromUserId: loggedInUser._id, status: "accepted" },
            ],
        })
        .populate("fromUserId", USER_SAFE_DATA)
        .populate("toUserId", USER_SAFE_DATA);

        const data = connectionRequests.map((row) => {
            if (row.fromUserId._id.equals(loggedInUser._id)) {
                return row.toUserId;
            }
            return row.fromUserId;
        });

        res.json({ data });
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
});
userRouter.get("/user/feed",userAuth,async(req,res)=>{
    // User should see other users other than [himself , his connections , ignored , already sent the connection request]
    try{
        const loggedInUser = req.user;
        // Find all connection requests sent or recieved by the logged-in user
        const connectionRequest = await ConnectionRequest.find({
            $or: [{fromUserId : loggedInUser._id}, {toUserId: loggedInUser._id}],
        })
    }catch(err){
        res.status(400).send({ message: err.message });
    }
})

module.exports = userRouter;