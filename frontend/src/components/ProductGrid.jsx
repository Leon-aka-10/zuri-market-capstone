import ProductCard from "./ProductCard";

const ProductGrid = ({ products, loading, error, onAddToCart }) => {
  if (loading) {
    return (
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
        gap: "20px",
        padding: "32px",
      }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} style={{
            background: "var(--bg-card)",
            border: "0.5px solid var(--border)",
            borderRadius: "var(--radius-lg)",
            overflow: "hidden",
          }}>
            <div style={{
              aspectRatio: "1",
              background: "var(--bg-secondary)",
              animation: "pulse 1.5s ease-in-out infinite",
            }} />
            <div style={{ padding: "14px 16px 16px", display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ height: "12px", width: "40%", background: "var(--bg-secondary)", borderRadius: "var(--radius-sm)", animation: "pulse 1.5s ease-in-out infinite" }} />
              <div style={{ height: "16px", width: "70%", background: "var(--bg-secondary)", borderRadius: "var(--radius-sm)", animation: "pulse 1.5s ease-in-out infinite" }} />
              <div style={{ height: "12px", width: "90%", background: "var(--bg-secondary)", borderRadius: "var(--radius-sm)", animation: "pulse 1.5s ease-in-out infinite" }} />
            </div>
          </div>
        ))}
        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.4; }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 32px",
        gap: "12px",
      }}>
        <span style={{ fontSize: "32px" }}>⚠️</span>
        <p style={{ fontSize: "15px", fontWeight: 500, color: "var(--text-primary)" }}>
          Could not load products
        </p>
        <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>{error}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 32px",
        gap: "12px",
      }}>
        <span style={{ fontSize: "32px" }}>🛍️</span>
        <p style={{ fontSize: "15px", fontWeight: 500, color: "var(--text-primary)" }}>
          No products found
        </p>
        <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
          Try selecting a different category
        </p>
      </div>
    );
  }

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
      gap: "20px",
      padding: "32px",
    }}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
};

export default ProductGrid;