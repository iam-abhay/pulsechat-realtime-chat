const http = require("http");
const express = require("express");
const cors = require("cors");
const { port, clientUrl } = require("./config");
const messageRoutes = require("./routes/messageRoutes");
const setupSocket = require("./socket");

const app = express();
const server = http.createServer(app);

app.use(cors({
  origin: clientUrl,
  methods: ["GET", "POST", "OPTIONS"]
}));
app.use(express.json({ limit: "20kb" }));

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "realtime-chat-backend",
    timestamp: new Date().toISOString()
  });
});

app.use("/api/messages", messageRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error." });
});

const io = setupSocket(server);
app.set("io", io);

server.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
  console.log(`Allowed frontend origin: ${clientUrl}`);
});