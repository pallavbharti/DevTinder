const mongoose = require('mongoose');
const connectionRequestSchema =  new mongoose.Schema({
    fromUserId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    toUserId:{
        type: mongoose.Schema.Types.ObjectId
        
    },
    status:{
        type: String,
        enum:{
            values:["ignored", "interested", "accepted", "rejected" ],
            message: '{VALUE} is not supported'
        }
    }
},{
    timestamps:true
});
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 }, { unique: true });
connectionRequestSchema.pre('save', function () {
    const connectionRequest = this;

    if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        throw new Error("Cannot send connection request to yourself");
    }
});
const ConnectionRequest = mongoose.model("ConnectionRequest", connectionRequestSchema);

module.exports = ConnectionRequest;
