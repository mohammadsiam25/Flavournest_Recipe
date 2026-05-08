import API_URL from "../api.js";
import { useEffect, useState } from "react";
import RecipeCard from "../components/RecipeCard";
import "./HomePage.css";

const CATEGORIES = [
  { value: "", label: "All", emoji: "🍴" },
  { value: "Breakfast", label: "Breakfast", emoji: "🍳" },
  { value: "Lunch", label: "Lunch", emoji: "🥗" },
  { value: "Dinner", label: "Dinner", emoji: "🍽️" },
  { value: "Snacks", label: "Snacks", emoji: "🍿" },
  { value: "Desserts", label: "Desserts", emoji: "🍰" },
  { value: "Drinks", label: "Drinks", emoji: "🥤" },
  { value: "Vegetarian", label: "Vegetarian", emoji: "🥦" },
  { value: "Vegan", label: "Vegan", emoji: "🌿" },
  { value: "Seafood", label: "Seafood", emoji: "🦐" },
  { value: "Fast Food", label: "Fast Food", emoji: "🍔" },
  { value: "Soup", label: "Soup", emoji: "🍲" },
  { value: "Salad", label: "Salad", emoji: "🥙" },
];

export default function HomePage({ onAddRecipe, onRecipeClick }) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("");

  const fetchRecipes = (category = "") => {
    setLoading(true);
    const url = category
      ? `${API_URL}/recipe?category=${encodeURIComponent(category)}`
      : `${API_URL}/recipe`;
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        setRecipes(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchRecipes(activeCategory);
  }, [activeCategory]);

  const filtered = recipes.filter((r) =>
    r.title?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="home-page">
      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <span className="hero-badge">🌿 Fresh Recipes Daily</span>
          <h1 className="hero-title">
            Cook Something
            <br />
            <em>Beautiful</em> Today
          </h1>
          <p className="hero-desc">
            Discover, create, and share recipes that bring people together. From
            quick weeknight dinners to weekend feasts.
          </p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={onAddRecipe}>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Share Your Recipe
            </button>
            <div className="hero-stats">
              <div className="stat">
                <strong>{recipes.length}</strong>
                <span>Recipes</span>
              </div>
              <div className="stat-divider" />
              <div className="stat">
                <strong>∞</strong>
                <span>Ideas</span>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-bowl-wrap">
            <img
              src="https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=500&q=85"
              alt="Food bowl"
              className="hero-bowl"
            />
          </div>
          <div className="hero-tag tag-1">⏱ 30 min</div>
          <div className="hero-tag tag-2">🌶 Spicy</div>
          <div className="hero-tag tag-3">⭐ 4.9</div>
        </div>
        <div className="hero-wave">
          <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
            <path
              d="M0,60 C360,110 1080,10 1440,60 L1440,100 L0,100 Z"
              fill="var(--cream)"
            />
          </svg>
        </div>
      </section>

      {/* Recipe Section */}
      <section className="recipes-section container">
        <div className="section-header">
          <div>
            <h2 className="section-title">All Recipes</h2>
            <p className="section-subtitle">
              Click any recipe to see full details
            </p>
          </div>
          <div className="search-wrap">
            <svg
              className="search-icon"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              className="search-input"
              type="text"
              placeholder="Search recipes…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="category-scroll-wrap">
          <div className="category-tabs">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                className={`category-tab ${activeCategory === cat.value ? "active" : ""}`}
                onClick={() => {
                  setActiveCategory(cat.value);
                  setSearch("");
                }}
              >
                <span>{cat.emoji}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="recipes-skeleton">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="skeleton-card" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">🥘</span>
            <h3>
              {search ? "No recipes found" : "No recipes in this category yet"}
            </h3>
            <p>
              {search
                ? "Try a different search term"
                : "Be the first to share a recipe here!"}
            </p>
          </div>
        ) : (
          <div className="recipes-grid">
            {filtered.map((recipe, i) => {
              const favIds = (() => {
                try {
                  return JSON.parse(
                    localStorage.getItem("fn_favourites") || "[]",
                  );
                } catch {
                  return [];
                }
              })();
              return (
                <div
                  key={recipe._id}
                  style={{ animationDelay: `${i * 0.07}s` }}
                >
                  <RecipeCard
                    recipe={recipe}
                    mode="home"
                    isFav={favIds.includes(recipe._id)}
                    onRecipeClick={onRecipeClick}
                  />
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
