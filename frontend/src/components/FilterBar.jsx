const CATEGORIES = [
  { value: "all", label: "All" },
  { value: "gear", label: "Gear" },
  { value: "apparel", label: "Apparel" },
  { value: "home", label: "Home" },
  { value: "tech", label: "Tech" },
];

const FilterBar = ({ activeCategory, onCategoryChange }) => {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: "20px 32px",
      borderBottom: "0.5px solid var(--border)",
      background: "var(--bg-card)",
      overflowX: "auto",
    }}>
      {CATEGORIES.map((cat) => {
        const isActive = activeCategory === cat.value;
        return (
          <button
            key={cat.value}
            onClick={() => onCategoryChange(cat.value)}
            style={{
              padding: "7px 18px",
              borderRadius: "var(--radius-full)",
              fontSize: "13px",
              fontWeight: isActive ? 500 : 400,
              border: isActive ? "none" : "1px solid var(--border-hover)",
              background: isActive ? "var(--text-primary)" : "transparent",
              color: isActive ? "var(--bg-card)" : "var(--text-secondary)",
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "all 0.15s",
            }}
          >
            {cat.label}
          </button>
        );
      })}
    </div>
  );
};

export default FilterBar;