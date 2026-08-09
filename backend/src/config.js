require("dotenv").config();

const clientUrlEnv = process.env.CLIENT_URL || "http://localhost:5173,https://frontend-vert-phi-55.vercel.app";
const clientUrl = clientUrlEnv.includes(",") 
  ? clientUrlEnv.split(",").map(url => url.trim()) 
  : clientUrlEnv;

module.exports = {
  port: Number(process.env.PORT || 5000),
  clientUrl,
  dbFile: process.env.DB_FILE || "./data/chat.db"
};