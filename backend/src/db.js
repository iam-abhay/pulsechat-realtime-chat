const fs = require("fs");
const path = require("path");
const Database = require("better-sqlite3");
const { dbFile } = require("./config");

const resolvedDb = path.resolve(__dirname, "..", dbFile);
fs.mkdirSync(path.dirname(resolvedDb), { recursive: true });

const db = new Database(resolvedDb);
db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    text TEXT NOT NULL,
    created_at TEXT NOT NULL
  );
`);

const insertMessage = db.prepare(`
  INSERT INTO messages (username, text, created_at)
  VALUES (?, ?, ?)
`);

const getMessages = db.prepare(`
  SELECT id, username, text, created_at AS createdAt
  FROM messages
  ORDER BY id ASC
  LIMIT ?
`);

function createMessage(username, text) {
  const createdAt = new Date().toISOString();
  const result = insertMessage.run(username, text, createdAt);
  return {
    id: Number(result.lastInsertRowid),
    username,
    text,
    createdAt
  };
}

function listMessages(limit = 100) {
  return getMessages.all(Math.min(Math.max(Number(limit) || 100, 1), 500));
}

module.exports = { createMessage, listMessages };