const { createMessage, listMessages } = require("../db");

function sendMessage(req, res, next) {
  try {
    const { username, text } = req.body || {};

    if (!username || !username.trim()) {
      return res.status(400).json({ error: "Username is required." });
    }

    if (!text || !text.trim()) {
      return res.status(400).json({ error: "Message text is required." });
    }

    const cleanUsername = username.trim().slice(0, 30);
    const cleanText = text.trim().slice(0, 1000);
    const message = createMessage(cleanUsername, cleanText);

    const io = req.app.get("io");
    if (io) {
      io.emit("message:new", message);
    }

    return res.status(201).json(message);
  } catch (error) {
    next(error);
  }
}

function getHistory(req, res, next) {
  try {
    const messages = listMessages(req.query.limit);
    res.json({ messages });
  } catch (error) {
    next(error);
  }
}

module.exports = { sendMessage, getHistory };