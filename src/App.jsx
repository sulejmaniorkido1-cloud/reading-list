import { useState, useEffect } from "react";
import "./App.css";
import BookForm from "./components/BookForm";
import FilterBar from "./components/FilterBar";
import BookCard from "./components/BookCard";
import Login from "./components/Login";
import { getBooks, addBook, updateBook, deleteBook } from "./api";

function App() {
   const [user, setUser] = useState(null);
  const [books, setBooks] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkToken() {
      const token = localStorage.getItem("token");
      const name = localStorage.getItem("username");
      if (token && name) {
        setUser(name);
        const data = await getBooks();
        setBooks(data);
      }
      setLoading(false);
    }
    checkToken();
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "white", fontSize: 20, fontWeight: 700 }}>Loading...</p>
      </div>
    );
  }

  function handleLogout() {
    setUser(null);
    setBooks([]);
    setFilter("All");
    localStorage.removeItem("token");
  }
  async function handleLogin(name) {
    setUser(name);
    localStorage.setItem("username", name);
    const data = await getBooks();
    setBooks(data);
  }
function handleLogout() {
    setUser(null);
    setBooks([]);
    setFilter("All");
    localStorage.removeItem("token");
    localStorage.removeItem("username");
  }
  async function handleAdd(newBook) {
    await addBook(newBook);
    setBooks((prev) => [newBook, ...prev]);
  }

  async function handleDelete(id) {
    await deleteBook(id);
    setBooks((prev) => prev.filter((b) => b.id !== id));
  }

  async function handleUpdate(updatedBook) {
    await updateBook(updatedBook);
    setBooks((prev) =>
      prev.map((b) => (b.id === updatedBook.id ? updatedBook : b))
    );
  }

  const visibleBooks =
    filter === "All" ? books : books.filter((b) => b.status === filter);

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="app">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: "white", textShadow: "0 2px 4px rgba(0,0,0,0.8)" }}>
          📖 My Reading List
        </h1>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ color: "white", fontSize: 14, textShadow: "0 2px 4px rgba(0,0,0,0.8)" }}>
            👤 {user}
          </span>
          <button
            onClick={handleLogout}
            style={{
              padding: "8px 16px",
              background: "rgba(220,38,38,0.7)",
              color: "white",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              fontWeight: 600,
              fontSize: 13,
            }}
          >
            Logout
          </button>
        </div>
      </div>

      <p style={{ color: "white", marginBottom: 24, fontSize: 14, textShadow: "0 2px 4px rgba(0,0,0,0.8)" }}>
        {books.length} book{books.length !== 1 ? "s" : ""} tracked
      </p>

      <BookForm onAdd={handleAdd} />
      <FilterBar active={filter} onChange={setFilter} />

      {visibleBooks.length === 0 ? (
        <p className="empty" style={{ color: "white" }}>No books here yet.</p>
      ) : (
        <div className="grid">
          {visibleBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
