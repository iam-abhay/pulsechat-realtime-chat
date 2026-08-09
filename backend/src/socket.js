const { Server } = require("socket.io");
const { createMessage } = require("./db");
const { clientUrl } = require("./config");

function setupSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: clientUrl,
      methods: ["GET", "POST"]
    }
  });

  const onlineUsers = new Map();

  io.on("connection", (socket) => {
    socket.on("user:join", (username) => {
      const cleanUsername = String(username || "").trim().slice(0, 30);
      if (!cleanUsername) return;

      socket.data.username = cleanUsername;
      onlineUsers.set(socket.id, cleanUsername);

      socket.emit("user:joined", {
        username: cleanUsername,
        socketId: socket.id
      });

      io.emit("users:update", {
        users: Array.from(new Set(onlineUsers.values()))
      });
    });

    socket.on("message:send", (payload, ack) => {
      try {
        const username = socket.data.username || String(payload?.username || "").trim();
        const text = String(payload?.text || "").trim();

        if (!username || !text) {
          return ack?.({ ok: false, error: "Username and message are required." });
        }

        const message = createMessage(username, text.slice(0, 1000));
        io.emit("message:new", message);

        ack?.({ ok: true, message });
      } catch (error) {
        ack?.({ ok: false, error: "Unable to send message." });
      }
    });

    socket.on("typing:start", () => {
      if (socket.data.username) {
        socket.broadcast.emit("typing:update", {
          username: socket.data.username,
          typing: true
        });
      }
    });

    socket.on("typing:stop", () => {
      if (socket.data.username) {
        socket.broadcast.emit("typing:update", {
          username: socket.data.username,
          typing: false
        });
      }
    });

    socket.on("disconnect", () => {
      onlineUsers.delete(socket.id);
      io.emit("users:update", {
        users: Array.from(new Set(onlineUsers.values()))
      });
    });
  });

  return io;
}

module.exports = setupSocket;