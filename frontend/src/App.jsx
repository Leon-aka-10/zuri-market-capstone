import { useState, useEffect } from "react";
import useCart from "./hooks/useCart";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import FilterBar from "./components/FilterBar";
import ProductGrid from "./components/ProductGrid";
import CartSidebar from "./components/CartSidebar";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const App = () => {
  const [products, setProducts] = useState([]);
  const [storeName, setStoreName] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [cartOpen, setCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    cartTotal,
  } = useCart();

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const res = await fetch(`${API_URL}/api/store`);
        const data = await res.json();
        setStoreName(data.name);
      } catch {
        setStoreName(import.meta.env.VITE_STORE_NAME || "Shop");
      }
    };
    fetchStore();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const url =
          activeCategory === "all"
            ? `${API_URL}/api/products`
            : `${API_URL}/api/products?category=${activeCategory}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [activeCategory]);

  return (
    <div>
      <Navbar
        storeName={storeName}
        cartCount={cartCount}
        onCartOpen={() => setCartOpen(true)}
      />
      <Hero storeName={storeName} />
      <FilterBar
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
      <ProductGrid
        products={products}
        loading={loading}
        error={error}
        onAddToCart={addToCart}
      />
      {cartOpen && (
        <>
          <div className="backdrop" onClick={() => setCartOpen(false)} />
          <CartSidebar
            cartItems={cartItems}
            cartTotal={cartTotal}
            onRemove={removeFromCart}
            onUpdateQuantity={updateQuantity}
            onClear={clearCart}
            onClose={() => setCartOpen(false)}
          />
        </>
      )}
    </div>
  );
};

export default App;