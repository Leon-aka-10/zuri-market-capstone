const Navbar = ({ storeName, cartCount, onCartOpen }) => {
  return (
    <nav style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "14px 32px",
      background: "var(--bg-card)",
      borderBottom: "0.5px solid var(--border)",
      position: "sticky",
      top: 0,
      zIndex: 30,
    }}>
      <span style={{ fontSize: "18px", fontWeight: 600, letterSpacing: "-0.4px" }}>
        {storeName || "Shop"}
        <span style={{ color: "var(--accent)" }}>.</span>
      </span>

      <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
        <span style={{ fontSize: "14px", color: "var(--text-secondary)", cursor: "pointer" }}>
          Products
        </span>
        <span style={{ fontSize: "14px", color: "var(--text-secondary)", cursor: "pointer" }}>
          About
        </span>
        <button
          onClick={onCartOpen}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "14px",
            fontWeight: 500,
            padding: "8px 16px",
            borderRadius: "var(--radius-full)",
            border: "1px solid var(--border-hover)",
            background: "var(--bg-secondary)",
            color: "var(--text-primary)",
            transition: "background 0.15s",
          }}
        >
          Cart
          {cartCount > 0 && (
            <span style={{
              background: "var(--accent)",
              color: "#fff",
              fontSize: "11px",
              fontWeight: 600,
              borderRadius: "var(--radius-full)",
              padding: "1px 7px",
              minWidth: "20px",
              textAlign: "center",
            }}>
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;