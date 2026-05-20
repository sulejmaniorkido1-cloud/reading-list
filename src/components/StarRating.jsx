import { useState } from "react";

function StarRating({ value, onChange, readOnly }) {
  const [hovered, setHovered] = useState(0);

  return (
    <div style={{ display: "flex", gap: 4 }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => !readOnly && onChange(star === value ? 0 : star)}
          onMouseEnter={() => !readOnly && setHovered(star)}
          onMouseLeave={() => !readOnly && setHovered(0)}
          style={{
            fontSize: 22,
            cursor: readOnly ? "default" : "pointer",
            color: star <= (hovered || value) ? "#F59E0B" : "#D1D5DB",
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default StarRating;
