const express = require("express");
const {
  sendMessage,
  getHistory
} = require("../controllers/messageController");

const router = express.Router();

router.get("/", getHistory);
router.post("/", sendMessage);

module.exports = router;