import { useState } from "react";
import StarRating from "./StarRating";

const STATUSES = ["Want to Read", "Currently Reading", "Finished"];

const STATUS_COLORS = {
  "Want to Read": { bg: "#EEF2FF", color: "#4338CA" },
  "Currently Reading": { bg: "#FFF7ED", color: "#C2410C" },
  "Finished": { bg: "#F0FDF4", color: "#15803D" },
};

function BookCard({ book, onDelete, onUpdate }) {
  const [confirming, setConfirming] = useState(false);
  const s = STATUS_COLORS[book.status];

  function change(field, value) {
    onUpdate({ ...book, [field]: value });
  }

  return (
    <div
      className="book-card"
      style={{
        background: "rgba(255, 255, 255, 0.75)",
        backdropFilter: "blur(12px)",
        borderRadius: 16,
        overflow: "hidden",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Book Cover */}
      <div style={{
        width: "100%",
        height: 200,
        background: "#e5e7eb",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}>
        {book.cover ? (
          <img
            src={book.cover}
            alt={book.title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <span style={{ fontSize: 48 }}>📚</span>
        )}
      </div>

      {/* Card Content */}
      <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>

        {/* Status Badge */}
        <span style={{
          alignSelf: "flex-start",
          padding: "3px 10px",
          borderRadius: 20,
          fontSize: 12,
          fontWeight: 600,
          background: s.bg,
          color: s.color,
        }}>
          {book.status}
        </span>

        {/* Title & Author */}
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 700 }}>{book.title}</h3>
          <p style={{ fontSize: 13, color: "#6B7280" }}>by {book.author}</p>
        </div>

        {/* Genre */}
        <span style={{ fontSize: 12, color: "#9CA3AF" }}>Genre: {book.genre}</span>

        {/* Status Changer */}
        <select
          value={book.status}
          onChange={(e) => change("status", e.target.value)}
          style={{
            padding: "6px 10px",
            borderRadius: 8,
            border: "1px solid #D1D5DB",
            fontSize: 13,
            background: "white",
          }}
        >
          {STATUSES.map((st) => <option key={st}>{st}</option>)}
        </select>

        {/* Rating & Note — only when Finished */}
        {book.status === "Finished" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <StarRating
              value={book.rating}
              onChange={(v) => change("rating", v)}
            />
            <textarea
              placeholder="Write a personal note..."
              value={book.note}
              onChange={(e) => change("note", e.target.value)}
              rows={2}
              style={{
                padding: "8px",
                border: "1px solid #D1D5DB",
                borderRadius: 8,
                fontSize: 13,
                resize: "vertical",
                background: "rgba(255,255,255,0.8)",
              }}
            />
          </div>
        )}

        {/* Remove Button / Inline Confirmation */}
        {!confirming ? (
          <button
            onClick={() => setConfirming(true)}
            style={{
              marginTop: 12,
              padding: "10px 22px",
              background: "linear-gradient(135deg, #EF4444, #DC2626)",
              color: "white",
              border: "none",
              borderRadius: 12,
              cursor: "pointer",
              fontSize: 14,
              fontWeight: "bold",
              alignSelf: "center",
              transition: "0.3s ease",
              boxShadow: "0 4px 12px rgba(220,38,38,0.3)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            🗑 Remove Book
          </button>
        ) : (
          <div style={{
            marginTop: 12,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            background: "#FEF2F2",
            border: "1px solid #FECACA",
            borderRadius: 12,
            padding: "12px 16px",
          }}>
            <span style={{ fontSize: 13, color: "#991B1B", fontWeight: 600 }}>
              Remove this book?
            </span>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => { onDelete(book.id); setConfirming(false); }}
                style={{
                  padding: "7px 16px",
                  background: "linear-gradient(135deg, #EF4444, #DC2626)",
                  color: "white",
                  border: "none",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: "bold",
                  boxShadow: "0 2px 8px rgba(220,38,38,0.3)",
                }}
              >
                Yes, remove
              </button>
              <button
                onClick={() => setConfirming(false)}
                style={{
                  padding: "7px 16px",
                  background: "#F3F4F6",
                  color: "#374151",
                  border: "1px solid #D1D5DB",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: "bold",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
export default BookCard;
