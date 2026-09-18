import React from "react";
import { useEffect, useMemo, useState } from "react";

import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  ChevronRight,
  Cpu, 
  Gamepad2,
  Home,
  Menu,
  RotateCcw,
  Search,
  ShoppingBag,
  Shirt,
  Sparkles,
  Star,
  Truck,
  User,
  Watch,
  X,
} from "lucide-react";

const API = "http://localhost:5000/api";

const categories = [
  { name: "Electronics", icon: Cpu },
  { name: "Books", icon: BookOpen },
  { name: "Fashion", icon: Shirt },
  { name: "Home & Kitchen", icon: Home },
  { name: "Sports", icon: Sparkles },
  { name: "Toy & Games", icon: Gamepad2 },
];

function formatPrice(value) {
  return `₹${value.toLocaleString("en-IN")}`;
}

function ProductCard({ product, onAdd }) {
  return (
    <article className="product-card">
      <div className="product-image-wrap">
        <img src={product.image} alt={product.name} className="product-image" />
        <button
          className="heart-button"
          aria-label={`Add ${product.name} to wishlist`}
          onClick={() => alert("Wishlist feature ready to connect!")}
        >
          ♡
        </button>
      </div>

      <div className="product-content">
        <p className="product-category">{product.category}</p>
        <h3>{product.name}</h3>

        <div className="product-bottom">
          <div>
            <div className="price">{formatPrice(product.price)}</div>
            <div className="rating">
              <span className="stars">
                {"★".repeat(Math.floor(product.rating))}
              </span>
              <span>{product.rating}</span>
            </div>
          </div>

          <button className="add-button" onClick={() => onAdd(product)}>
            Add
          </button>
        </div>
      </div>
    </article>
  );
}

function LoginModal({ onClose }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="login-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={19} />
        </button>
        <div className="modal-icon">
          <User size={24} />
        </div>
        <h2>Welcome to ShopSmart</h2>
        <p>Sign in to get personalized recommendations.</p>

        <label>Email</label>
        <input type="email" placeholder="you@example.com" />

        <label>Password</label>
        <input type="password" placeholder="••••••••" />

        <button
          className="login-submit"
          onClick={() => {
            alert("Demo login successful!");
            onClose();
          }}
        >
          Login
        </button>

        <small>Demo UI — connect this form to your authentication API.</small>
      </div>
    </div>
  );
}

export default function App() {
  const [recommendations, setRecommendations] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [loginOpen, setLoginOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [recommendationResponse, productsResponse] = await Promise.all([
          fetch(`${API}/recommendations/101`),
          fetch(`${API}/products`),
        ]);

        const recommendationData = await recommendationResponse.json();
        const productData = await productsResponse.json();

        setRecommendations(recommendationData.recommendations);
        setAllProducts(productData);
      } catch (error) {
        console.error(error);
        alert("Backend is not running. Start it with npm run dev.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const visibleProducts = useMemo(() => {
    const q = search.trim().toLowerCase();

    return allProducts.filter((product) => {
      const matchesCategory =
        activeCategory === "All" || product.category === activeCategory;
      const matchesSearch =
        !q ||
        product.name.toLowerCase().includes(q) ||
        product.category.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [allProducts, activeCategory, search]);

  const handleCategory = (category) => {
    setActiveCategory(category);
    setSearch("");
  };

  const handleAdd = async (product) => {
    setCartCount((count) => count + 1);

    try {
      await fetch(`${API}/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: 101,
          event: "add_to_cart",
          productId: product.id,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch {
      // UI still works if the event endpoint is temporarily unavailable.
    }
  };

  return (
    <div className="app">
      <header className="navbar">
        <div className="nav-inner">
          <button
            className="mobile-menu-button"
            onClick={() => setMobileMenu((value) => !value)}
          >
            <Menu size={21} />
          </button>

          <a className="brand" href="#" onClick={() => handleCategory("All")}>
            <span className="brand-icon">
              <ShoppingBag size={22} strokeWidth={2.5} />
            </span>
            <span>
              Shop<span>Smart</span>
            </span>
          </a>

          <nav className={`nav-links ${mobileMenu ? "show" : ""}`}>
            <a href="#home" onClick={() => setMobileMenu(false)}>Home</a>
            <a href="#products" onClick={() => setMobileMenu(false)}>Products</a>
            <a href="#categories" onClick={() => setMobileMenu(false)}>Categories</a>
          </nav>

          <div className="search-box">
            <Search size={18} />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setActiveCategory("All");
              }}
              placeholder="Search for products..."
            />
            {search && (
              <button onClick={() => setSearch("")}>
                <X size={15} />
              </button>
            )}
          </div>

          <div className="nav-actions">
            <button className="cart-button" onClick={() => alert(`You have ${cartCount} item(s) in your cart.`)}>
              <ShoppingBag size={20} />
              {cartCount > 0 && <span>{cartCount}</span>}
            </button>

            <button className="login-button" onClick={() => setLoginOpen(true)}>
              <User size={17} />
              Login
            </button>
          </div>
        </div>
      </header>

      <main>
        <section className="main-grid" id="home">
          <aside className="sidebar" id="categories">
            <div className="sidebar-title">Categories</div>

            <button
              className={`category-row ${activeCategory === "All" ? "active" : ""}`}
              onClick={() => handleCategory("All")}
            >
              <Sparkles size={17} />
              <span>All Products</span>
            </button>

            {categories.map(({ name, icon: Icon }) => (
              <button
                key={name}
                className={`category-row ${
                  activeCategory === name ? "active" : ""
                }`}
                onClick={() => handleCategory(name)}
              >
                <Icon size={17} />
                <span>{name}</span>
              </button>
            ))}

            <button className="view-all" onClick={() => handleCategory("All")}>
              View all <ChevronRight size={16} />
            </button>
          </aside>

          <div className="content">
            <section className="hero">
              <div className="hero-copy">
                <div className="hero-kicker">
                  <span className="pulse"></span>
                  Hadoop-powered recommendations
                </div>
                <h1>
                  Smart Shopping
                  <br />
                  <span>Personalized</span> for You
                </h1>
                <p>
                  Discover products tailored to your preferences
                  <br className="desktop-only" />
                  and shopping behavior.
                </p>
                <button
                  className="primary-button"
                  onClick={() =>
                    document
                      .getElementById("products")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  Shop Now <ArrowRight size={17} />
                </button>
              </div>

              <div className="hero-art">
                <div className="hero-circle"></div>
                <div className="cart-illustration">
                  <div className="cart-handle"></div>
                  <div className="cart-basket">
                    <span className="cart-line line-one"></span>
                    <span className="cart-line line-two"></span>
                    <span className="cart-line line-three"></span>
                    <span className="cart-line line-four"></span>
                  </div>
                  <div className="wheel wheel-one"></div>
                  <div className="wheel wheel-two"></div>
                </div>
                <div className="hero-floating-card card-one">AI</div>
                <div className="hero-floating-card card-two">✓</div>
              </div>
            </section>

            <section className="feature-strip">
              <div className="feature">
                <div className="feature-icon"><Cpu size={20} /></div>
                <div>
                  <strong>Hadoop</strong>
                  <span>Powered</span>
                </div>
              </div>
              <div className="feature-divider"></div>
              <div className="feature">
                <div className="feature-icon"><Truck size={20} /></div>
                <div>
                  <strong>Fast</strong>
                  <span>delivery</span>
                </div>
              </div>
              <div className="feature-divider"></div>
              <div className="feature">
                <div className="feature-icon"><RotateCcw size={20} /></div>
                <div>
                  <strong>Easy</strong>
                  <span>return</span>
                </div>
              </div>
            </section>
          </div>
        </section>

        <section className="recommendation-section" id="products">
          <div className="section-heading">
            <div>
              <div className="eyebrow">RECOMMENDATION ENGINE</div>
              <h2>Recommended For You <span>(Powered by Hadoop)</span></h2>
            </div>

            <div className="carousel-controls">
              <button><ArrowLeft size={17} /></button>
              <button><ArrowRight size={17} /></button>
            </div>
          </div>

          {loading ? (
            <div className="loading-grid">
              {[1, 2, 3, 4].map((item) => <div className="skeleton" key={item}></div>)}
            </div>
          ) : (
            <div className="product-grid">
              {recommendations.map((product) => (
                <ProductCard key={product.id} product={product} onAdd={handleAdd} />
              ))}
            </div>
          )}
        </section>

        <section className="catalog-section">
          <div className="catalog-heading">
            <div>
              <div className="eyebrow">EXPLORE</div>
              <h2>
                {activeCategory === "All" ? "All Products" : activeCategory}
              </h2>
            </div>
            <span>{visibleProducts.length} products</span>
          </div>

          <div className="product-grid catalog-grid">
            {visibleProducts.map((product) => (
              <ProductCard key={product.id} product={product} onAdd={handleAdd} />
            ))}
          </div>

          {visibleProducts.length === 0 && (
            <div className="empty-state">
              <Search size={28} />
              <h3>No products found</h3>
              <p>Try another search term or category.</p>
            </div>
          )}
        </section>
      </main>

      <footer>
        <div>
          <strong>Shop<span>Smart</span></strong>
          <p>Smart e-commerce powered by Hadoop recommendations.</p>
        </div>
        <p>© 2026 ShopSmart • React + Node.js + Express.js + Hadoop</p>
      </footer>

      {loginOpen && <LoginModal onClose={() => setLoginOpen(false)} />}
    </div>
  );
}
