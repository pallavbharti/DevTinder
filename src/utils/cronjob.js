const cron = require("node-cron");
const ConnectionRequest = require("../models/connectionRequest");
const sendEmail = require("./sendEmail");

cron.schedule(
  "0 8 * * *",
  async () => {
    try {
      const yesterday = new Date();

      yesterday.setDate(yesterday.getDate() - 1);

      const yesterdayStart = new Date(yesterday);
      yesterdayStart.setHours(0, 0, 0, 0);

      const yesterdayEnd = new Date(yesterday);
      yesterdayEnd.setHours(23, 59, 59, 999);

      const pendingRequests = await ConnectionRequest.find({
        status: "interested",
        createdAt: {
          $gte: yesterdayStart,
          $lte: yesterdayEnd,
        },
      }).populate("fromUserId", "firstName lastName");

     const userDigest = {};

pendingRequests.forEach((request) => {
  const email = request.toUserId.emailId;

  if (!userDigest[email]) {
    userDigest[email] = {
      firstName: request.toUserId.firstName,
      requests: [],
    };
  }

  userDigest[email].requests.push(
    `${request.fromUserId.firstName} ${request.fromUserId.lastName}`
  );
});

console.log(userDigest);

      console.log("Users to notify:", emailIds);

      for (const email of emailIds) {
        await sendEmail(
          email,
          "DevTinder - New Connection Requests",
          "You have new connection requests waiting for you on DevTinder."
        );
      }
    } catch (error) {
      console.error(
        "Error occurred while sending emails:",
        error
      );
    }
  },
  {
    timezone: "Asia/Kolkata",
  }
);