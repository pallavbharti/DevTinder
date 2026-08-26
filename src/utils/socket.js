const { socket } = require("socket.io");

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // User chat room mein join karta hai
    socket.on("joinChat", ({ userId, targetUserId, firstName }) => {
      // Room ID — dono users ka combined ID (sorted taaki same room mile)
      const roomId = [userId, targetUserId].sort().join("_");
      console.log(firstName + " joined room: " + roomId);
      socket.join(roomId);
    });

    // Message bhejta hai
    socket.on("sendMessage", ({ userId, targetUserId, firstName, lastName, text }) => {
      const roomId = [userId, targetUserId].sort().join("_");
      console.log(firstName + " sent: " + text);

      // Doosre ko message bhejo
      io.to(roomId).emit("messageReceived", { firstName, lastName, text });
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};

module.exports = { initializeSocket };