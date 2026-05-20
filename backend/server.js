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
  const hashed = await bcrypt.hash(password, 10);
  db.run(
    "INSERT INTO users (firstName, lastName, email, password) VALUES (?, ?, ?, ?)",
    [firstName, lastName, email, hashed],
    function (err) {
      if (err) return res.status(400).json({ error: "Email already exists" });
      res.json({ message: "Account created!" });
    }
  );
});

// Login
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
    if (!user) return res.status(400).json({ error: "Wrong email or password" });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: "Wrong email or password" });
    const token = jwt.sign(
      { id: user.id, name: `${user.firstName} ${user.lastName}` },
      SECRET
    );
    res.json({ token, name: `${user.firstName} ${user.lastName}` });
  });
});

// Get books
app.get("/books", auth, (req, res) => {
  db.all("SELECT * FROM books WHERE userId = ?", [req.user.id], (err, books) => {
    res.json(books || []);
  });
});

// Add book
app.post("/books", auth, (req, res) => {
  const { id, title, author, genre, status, rating, note, cover } = req.body;
  db.run(
    "INSERT INTO books (id, userId, title, author, genre, status, rating, note, cover) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [id, req.user.id, title, author, genre, status, rating, note, cover],
    (err) => {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ message: "Book added!" });
    }
  );
});

// Update book
app.put("/books/:id", auth, (req, res) => {
  const { title, author, genre, status, rating, note, cover } = req.body;
  db.run(
    "UPDATE books SET title=?, author=?, genre=?, status=?, rating=?, note=?, cover=? WHERE id=? AND userId=?",
    [title, author, genre, status, rating, note, cover, req.params.id, req.user.id],
    (err) => {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ message: "Book updated!" });
    }
  );
});

// Delete book
app.delete("/books/:id", auth, (req, res) => {
  db.run(
    "DELETE FROM books WHERE id=? AND userId=?",
    [req.params.id, req.user.id],
    (err) => {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ message: "Book deleted!" });
    }
  );
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

