const CartSidebar = ({
  cartItems,
  cartTotal,
  onRemove,
  onUpdateQuantity,
  onClear,
  onClose,
}) => {
  return (
    <div style={{
      position: "fixed",
      top: 0,
      right: 0,
      height: "100vh",
      width: "100%",
      maxWidth: "420px",
      background: "var(--bg-card)",
      borderLeft: "0.5px solid var(--border)",
      display: "flex",
      flexDirection: "column",
      zIndex: 50,
      animation: "slideIn 0.25s ease",
    }}>

      {/* Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "20px 24px",
        borderBottom: "0.5px solid var(--border)",
      }}>
        <h2 style={{ fontSize: "16px", fontWeight: 600 }}>
          Your cart
          {cartItems.length > 0 && (
            <span style={{
              marginLeft: "8px",
              fontSize: "12px",
              fontWeight: 400,
              color: "var(--text-secondary)",
            }}>
              ({cartItems.length} {cartItems.length === 1 ? "item" : "items"})
            </span>
          )}
        </h2>
        <button
          onClick={onClose}
          style={{
            fontSize: "20px",
            color: "var(--text-secondary)",
            lineHeight: 1,
            padding: "4px",
            cursor: "pointer",
          }}
          aria-label="Close cart"
        >
          ✕
        </button>
      </div>

      {/* Empty state */}
      {cartItems.length === 0 ? (
        <div style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "12px",
          color: "var(--text-secondary)",
        }}>
          <span style={{ fontSize: "40px" }}>🛒</span>
          <p style={{ fontSize: "15px", fontWeight: 500, color: "var(--text-primary)" }}>
            Your cart is empty
          </p>
          <p style={{ fontSize: "13px" }}>Add some products to get started</p>
          <button
            onClick={onClose}
            style={{
              marginTop: "8px",
              padding: "9px 22px",
              borderRadius: "var(--radius-full)",
              background: "var(--text-primary)",
              color: "var(--bg-card)",
              fontSize: "13px",
              fontWeight: 500,
              cursor: "pointer",
              border: "none",
            }}
          >
            Continue shopping
          </button>
        </div>
      ) : (
        <>
          {/* Items list */}
          <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px" }}>
            {cartItems.map((item) => (
              <div key={item.id} style={{
                display: "flex",
                gap: "14px",
                paddingBottom: "16px",
                marginBottom: "16px",
                borderBottom: "0.5px solid var(--border)",
              }}>
                <img
                  src={item.image}
                  alt={item.name}
                  style={{
                    width: "72px",
                    height: "72px",
                    objectFit: "cover",
                    borderRadius: "var(--radius-md)",
                    border: "0.5px solid var(--border)",
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "4px" }}>
                  <p style={{ fontSize: "14px", fontWeight: 500, color: "var(--text-primary)" }}>
                    {item.name}
                  </p>
                  <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                    ${item.price}
                  </p>

                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginTop: "6px",
                  }}>
                    {/* Quantity controls */}
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0",
                      border: "0.5px solid var(--border-hover)",
                      borderRadius: "var(--radius-full)",
                      overflow: "hidden",
                    }}>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        style={{
                          width: "30px",
                          height: "28px",
                          fontSize: "16px",
                          color: "var(--text-primary)",
                          background: "transparent",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span style={{
                        fontSize: "13px",
                        fontWeight: 500,
                        minWidth: "24px",
                        textAlign: "center",
                        color: "var(--text-primary)",
                      }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        style={{
                          width: "30px",
                          height: "28px",
                          fontSize: "16px",
                          color: "var(--text-primary)",
                          background: "transparent",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <span style={{ fontSize: "14px", fontWeight: 500 }}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                      <button
                        onClick={() => onRemove(item.id)}
                        style={{
                          fontSize: "13px",
                          color: "var(--text-hint)",
                          cursor: "pointer",
                          textDecoration: "underline",
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div style={{
            padding: "20px 24px",
            borderTop: "0.5px solid var(--border)",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>Subtotal</span>
              <span style={{ fontSize: "18px", fontWeight: 600 }}>${cartTotal.toFixed(2)}</span>
            </div>
            <p style={{ fontSize: "12px", color: "var(--text-hint)" }}>
              Shipping and taxes calculated at checkout
            </p>
            <button style={{
              width: "100%",
              padding: "13px",
              borderRadius: "var(--radius-full)",
              background: "var(--text-primary)",
              color: "var(--bg-card)",
              fontSize: "14px",
              fontWeight: 500,
              border: "none",
              cursor: "pointer",
            }}>
              Checkout — ${cartTotal.toFixed(2)}
            </button>
            <button
              onClick={onClear}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "var(--radius-full)",
                background: "transparent",
                color: "var(--text-secondary)",
                fontSize: "13px",
                border: "0.5px solid var(--border-hover)",
                cursor: "pointer",
              }}
            >
              Clear cart
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartSidebar;