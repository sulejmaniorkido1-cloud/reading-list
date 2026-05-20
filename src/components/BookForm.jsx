import { useState } from "react";

const GENRES = ["Fiction", "Non-Fiction", "Science", "History", "Biography", "Fantasy", "Mystery", "Self-Help", "Other"];
const STATUSES = ["Want to Read", "Currently Reading", "Finished"];

function BookForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState(GENRES[0]);
  const [status, setStatus] = useState(STATUSES[0]);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim() || !author.trim()) return;

    setLoading(true);

    let coverUrl = "";
    try {
      const query = encodeURIComponent(title.trim());
      const res = await fetch(`https://openlibrary.org/search.json?title=${query}&limit=1`);
      const data = await res.json();
      if (data.docs && data.docs[0] && data.docs[0].cover_i) {
        coverUrl = `https://covers.openlibrary.org/b/id/${data.docs[0].cover_i}-L.jpg`;
      }
    } catch {
      coverUrl = "";
    }

    setLoading(false);

    const newBook = {
      id: crypto.randomUUID(),
      title: title.trim(),
      author: author.trim(),
      genre,
      status,
      rating: 0,
      note: "",
      cover: coverUrl,
    };

    onAdd(newBook);
    setTitle("");
    setAuthor("");
    setGenre(GENRES[0]);
    setStatus(STATUSES[0]);
  }

  const inputStyle = {
    padding: "8px 12px",
    border: "1px solid #D1D5DB",
    borderRadius: 8,
    fontSize: 14,
    width: "100%",
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        marginBottom: 32,
        background: "rgba(255, 255, 255, 0.75)",
        backdropFilter: "blur(6px)",
        padding: 20,
        borderRadius: 12,
        boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
      }}
    >
      <h2 style={{ fontSize: 16, fontWeight: 600 }}>Add a New Book</h2>
      <input
        style={inputStyle}
        placeholder="Title *"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        style={inputStyle}
        placeholder="Author *"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
      />
      <select style={inputStyle} value={genre} onChange={(e) => setGenre(e.target.value)}>
        {GENRES.map((g) => <option key={g}>{g}</option>)}
      </select>
      <select style={inputStyle} value={status} onChange={(e) => setStatus(e.target.value)}>
        {STATUSES.map((s) => <option key={s}>{s}</option>)}
      </select>
      <button
        type="submit"
        disabled={loading}
        style={{
          padding: "10px",
          background: loading ? "#A5B4FC" : "#4F46E5",
          color: "white",
          border: "none",
          borderRadius: 8,
          fontWeight: 600,
          cursor: loading ? "not-allowed" : "pointer",
          fontSize: 14,
        }}
      >
        {loading ? "Fetching cover..." : "Add Book"}
      </button>
    </form>
  );
}

export default BookForm;
