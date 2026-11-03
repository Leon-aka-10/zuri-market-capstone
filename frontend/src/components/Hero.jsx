const Hero = ({ storeName }) => {
  return (
    <div style={{
      padding: "48px 32px",
      background: "var(--bg-card)",
      borderBottom: "0.5px solid var(--border)",
    }}>
      <div style={{ maxWidth: "560px" }}>
        <span style={{
          display: "inline-block",
          fontSize: "11px",
          fontWeight: 500,
          letterSpacing: "0.5px",
          color: "var(--accent-text)",
          background: "var(--accent-light)",
          borderRadius: "var(--radius-full)",
          padding: "4px 12px",
          marginBottom: "16px",
          textTransform: "uppercase",
        }}>
          New arrivals
        </span>

        <h1 style={{
          fontSize: "36px",
          fontWeight: 600,
          lineHeight: 1.2,
          letterSpacing: "-0.8px",
          color: "var(--text-primary)",
          marginBottom: "12px",
        }}>
          Minimal goods,<br />maximum quality.
        </h1>

        <p style={{
          fontSize: "15px",
          color: "var(--text-secondary)",
          lineHeight: 1.7,
          marginBottom: "24px",
        }}>
          Welcome to {storeName || "our store"}. A curated collection of everyday
          essentials — designed to last, built to impress.
        </p>

        <div style={{ display: "flex", gap: "12px" }}>
          <button style={{
            padding: "10px 24px",
            borderRadius: "var(--radius-full)",
            background: "var(--text-primary)",
            color: "var(--bg)",
            fontSize: "14px",
            fontWeight: 500,
            border: "none",
            cursor: "pointer",
          }}>
            Shop now
          </button>
          <button style={{
            padding: "10px 24px",
            borderRadius: "var(--radius-full)",
            background: "transparent",
            color: "var(--text-primary)",
            fontSize: "14px",
            fontWeight: 500,
            border: "1px solid var(--border-hover)",
            cursor: "pointer",
          }}>
            Learn more
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;