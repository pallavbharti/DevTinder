const allowedOrigins = require("../config/allowedOrigins");
const { Server } = require("socket.io");
const crypto = require("crypto");
const mongoose = require("mongoose"); // NEW: markSeen mein ObjectId banane ke liye
const Chat = require("../models/chat");

const getSecretRoomId = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("_"))
    .digest("hex");
};

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Join chat room
    socket.on("joinChat", ({ userId, targetUserId, firstName }) => {
      const roomId = getSecretRoomId(userId, targetUserId);
      console.log(firstName + " joined room: " + roomId);
      socket.join(roomId);
    });

    // Send message
    socket.on(
      "sendMessage",
      async ({ userId, targetUserId, firstName, lastName, text }) => {
        try {
          const roomId = getSecretRoomId(userId, targetUserId);

          let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] },
          });

          if (!chat) {
            chat = new Chat({
              participants: [userId, targetUserId],
              messages: [],
            });
          }

          chat.messages.push({ senderId: userId, text });
          await chat.save();

          io.to(roomId).emit("messageReceived", {
            senderId: userId, // NEW: frontend isse pehchanta hai message kiska hai
            firstName,
            lastName,
            text,
            seen: false, // NEW: naya message abhi seen nahi hua
            timestamp: new Date(),
          });
        } catch (err) {
          console.error("Error sending message:", err);
        }
      }
    );

    // NEW: Typing indicator — DB nahi, sirf event aage bhejna hai
    socket.on("typing", ({ userId, targetUserId }) => {
      const roomId = getSecretRoomId(userId, targetUserId);
      socket.to(roomId).emit("typing"); // socket.to = bhejne wale ko chhod ke baaki sab
    });

    socket.on("stopTyping", ({ userId, targetUserId }) => {
      const roomId = getSecretRoomId(userId, targetUserId);
      socket.to(roomId).emit("stopTyping");
    });

    // NEW: Seen — saamne wale ke unseen messages ko DB mein seen: true
    socket.on("markSeen", async ({ userId, targetUserId }) => {
      try {
        const roomId = getSecretRoomId(userId, targetUserId);

        await Chat.updateOne(
          { participants: { $all: [userId, targetUserId] } },
          { $set: { "messages.$[m].seen": true } },
          {
            arrayFilters: [
              {
                "m.senderId": new mongoose.Types.ObjectId(targetUserId),
                "m.seen": { $ne: true }, // purane messages mein field hi nahi hai
              },
            ],
          }
        );

        socket.to(roomId).emit("messagesSeen"); // bhejne wale ko batao: padh liya
      } catch (err) {
        console.error("Error marking seen:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};

module.exports = { initializeSocket };