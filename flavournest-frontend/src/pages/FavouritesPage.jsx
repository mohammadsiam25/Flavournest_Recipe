import API_URL from "../api.js";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import RecipeCard from "../components/RecipeCard";
import "./FavouritesPage.css";

const FAV_KEY = "fn_favourites";

export default function FavouritesPage({ onRecipeClick }) {
  const { user } = useAuth();
  const [favIds, setFavIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(FAV_KEY) || "[]");
    } catch {
      return [];
    }
  });
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/recipe`)
      .then((r) => r.json())
      .then((data) => {
        const favs = Array.isArray(data)
          ? data.filter((r) => favIds.includes(r._id))
          : [];
        setRecipes(favs);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const removeFav = (id) => {
    const newIds = favIds.filter((fid) => fid !== id);
    setFavIds(newIds);
    localStorage.setItem(FAV_KEY, JSON.stringify(newIds));
    setRecipes((prev) => prev.filter((r) => r._id !== id));
  };

  return (
    <div className="fav-page">
      <div className="fav-header">
        <div className="fav-header-content container">
          <div>
            <h1 className="fav-title">
              <span className="fav-heart">♥</span> Favourites
            </h1>
            <p className="fav-subtitle">
              {recipes.length} saved{" "}
              {recipes.length === 1 ? "recipe" : "recipes"}
            </p>
          </div>
        </div>
      </div>

      <div className="fav-body container">
        {loading ? (
          <div className="recipes-grid">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton-card" />
            ))}
          </div>
        ) : recipes.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">🤍</span>
            <h3>No favourites yet</h3>
            <p>
              Tap the heart icon on any recipe to save it here for quick access.
            </p>
          </div>
        ) : (
          <div className="recipes-grid">
            {recipes.map((recipe, i) => (
              <div key={recipe._id} style={{ animationDelay: `${i * 0.08}s` }}>
                <RecipeCard
                  recipe={recipe}
                  mode="home"
                  isFav={true}
                  onFavToggle={(id, val) => !val && removeFav(id)}
                  onRecipeClick={onRecipeClick}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
