const Notification = require("../models/Notification");
let io;

const setIO = (socketIO) => {
  io = socketIO;
};

const createNotification = async ({ userId, title, message, type = "system", relatedId }) => {
  const notification = await Notification.create({
    userId,
    title,
    message,
    type,
    relatedId,
  });
  if (io) {
    io.to(userId.toString()).emit("notification", notification);
  }
  return notification;
};

module.exports = { createNotification, setIO };
