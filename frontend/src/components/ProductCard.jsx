const ProductCard = ({ product, onAddToCart }) => {
  const { name, category, price, image, badge, description } = product;

  return (
    <div style={{
      background: "var(--bg-card)",
      border: "0.5px solid var(--border)",
      borderRadius: "var(--radius-lg)",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      transition: "border-color 0.15s",
    }}
      onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--border-hover)"}
      onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--border)"}
    >
      <div style={{ position: "relative", aspectRatio: "1", overflow: "hidden" }}>
        <img
          src={image}
          alt={name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.3s ease",
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.04)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
        />
        {badge && (
          <span
            className={`badge badge--${badge}`}
            style={{ position: "absolute", top: "10px", left: "10px" }}
          >
            {badge}
          </span>
        )}
      </div>

      <div style={{
        padding: "14px 16px 16px",
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        flex: 1,
      }}>
        <span style={{ fontSize: "11px", color: "var(--text-hint)", textTransform: "capitalize" }}>
          {category}
        </span>
        <h3 style={{ fontSize: "15px", fontWeight: 500, color: "var(--text-primary)", lineHeight: 1.3 }}>
          {name}
        </h3>
        <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.6, flex: 1 }}>
          {description}
        </p>

        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: "10px",
        }}>
          <span style={{ fontSize: "16px", fontWeight: 600, color: "var(--text-primary)" }}>
            ${price}
          </span>
          <button
            onClick={() => onAddToCart(product)}
            style={{
              padding: "8px 16px",
              borderRadius: "var(--radius-full)",
              background: "var(--text-primary)",
              color: "var(--bg-card)",
              fontSize: "13px",
              fontWeight: 500,
              border: "none",
              cursor: "pointer",
              transition: "opacity 0.15s",
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = "0.8"}
            onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
          >
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;