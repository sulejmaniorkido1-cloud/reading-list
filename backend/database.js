const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./reading.db");

db.serialize(() => {
  // Users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      firstName TEXT NOT NULL,
      lastName TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    )
  `);

  // Books table
  db.run(`
    CREATE TABLE IF NOT EXISTS books (
      id TEXT PRIMARY KEY,
      userId INTEGER NOT NULL,
      title TEXT NOT NULL,
      author TEXT NOT NULL,
      genre TEXT NOT NULL,
      status TEXT NOT NULL,
      rating INTEGER DEFAULT 0,
      note TEXT DEFAULT '',
      cover TEXT DEFAULT '',
      FOREIGN KEY (userId) REFERENCES users(id)
    )
  `);
});

module.exports = db;
