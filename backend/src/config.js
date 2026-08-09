require("dotenv").config();

module.exports = {
  port: Number(process.env.PORT || 5000),
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  dbFile: process.env.DB_FILE || "./data/chat.db"
};