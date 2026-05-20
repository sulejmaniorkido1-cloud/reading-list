const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const db = require("./database");

const app = express();
const SECRET = "reading_list_secret_key";

app.use(cors());
app.use(express.json());

// Middleware to verify token
function auth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });
  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

// Register
app.post("/register", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    const stmt = db.prepare("INSERT INTO users (firstName, lastName, email, password) VALUES (?, ?, ?, ?)");
    stmt.run(firstName, lastName, email, hashed);
    res.json({ message: "Account created!" });
  } catch (err) {
    res.status(400).json({ error: "Email already exists" });
  }
});

// Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
    if (!user) return res.status(400).json({ error: "Wrong email or password" });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: "Wrong email or password" });
    const token = jwt.sign(
      { id: user.id, name: `${user.firstName} ${user.lastName}` },
      SECRET
    );
    res.json({ token, name: `${user.firstName} ${user.lastName}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get books
app.get("/books", auth, (req, res) => {
  try {
    const books = db.prepare("SELECT * FROM books WHERE userId = ?").all(req.user.id);
    res.json(books || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add book
app.post("/books", auth, (req, res) => {
  const { id, title, author, genre, status, rating, note, cover } = req.body;
  try {
    db.prepare("INSERT INTO books (id, userId, title, author, genre, status, rating, note, cover) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)").run(id, req.user.id, title, author, genre, status, rating, note, cover);
    res.json({ message: "Book added!" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update book
app.put("/books/:id", auth, (req, res) => {
  const { title, author, genre, status, rating, note, cover } = req.body;
  try {
    db.prepare("UPDATE books SET title=?, author=?, genre=?, status=?, rating=?, note=?, cover=? WHERE id=? AND userId=?").run(title, author, genre, status, rating, note, cover, req.params.id, req.user.id);
    res.json({ message: "Book updated!" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete book
app.delete("/books/:id", auth, (req, res) => {
  try {
    db.prepare("DELETE FROM books WHERE id=? AND userId=?").run(req.params.id, req.user.id);
    res.json({ message: "Book deleted!" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
