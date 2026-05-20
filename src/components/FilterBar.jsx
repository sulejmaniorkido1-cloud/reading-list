const FILTERS = ["All", "Want to Read", "Currently Reading", "Finished"];

function FilterBar({ active, onChange }) {
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
      {FILTERS.map((f) => (
        <button
          key={f}
          onClick={() => onChange(f)}
          style={{
            padding: "8px 16px",
            borderRadius: 20,
            border: "1.5px solid",
            borderColor: active === f ? "#4F46E5" : "#D1D5DB",
            background: active === f ? "#4F46E5" : "white",
            color: active === f ? "white" : "#374151",
            cursor: "pointer",
            fontWeight: active === f ? 600 : 400,
          }}
        >
          {f}
        </button>
      ))}
    </div>
  );
}

export default FilterBar;