import { useState } from "react";
import "./RecipeCard.css";

export default function RecipeCard({
  recipe,
  mode = "home",
  onEdit,
  onDelete,
  onFavToggle,
  isFav,
  onRecipeClick,
}) {
  const getFavFromStorage = () => {
    try {
      const favs = JSON.parse(localStorage.getItem("fn_favourites") || "[]");
      return favs.includes(recipe._id);
    } catch {
      return false;
    }
  };

  const [fav, setFav] = useState(
    isFav !== undefined ? isFav : getFavFromStorage(),
  );

  const handleFav = (e) => {
    e.stopPropagation();
    const newFav = !fav;
    setFav(newFav);

    try {
      const favs = JSON.parse(localStorage.getItem("fn_favourites") || "[]");
      let newFavs;
      if (newFav) {
        newFavs = [...new Set([...favs, recipe._id])];
      } else {
        newFavs = favs.filter((id) => id !== recipe._id);
      }
      localStorage.setItem("fn_favourites", JSON.stringify(newFavs));
    } catch {}

    if (onFavToggle) onFavToggle(recipe._id, newFav);
  };

  const imgSrc = recipe.coverImage
    ? `/images/${recipe.coverImage}`
    : `https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80`;

  const handleCardClick = () => {
    if (onRecipeClick) onRecipeClick(recipe._id);
  };

  // ── Rating calculation ──
  const avgRating =
    recipe.averageRating ||
    (() => {
      if (!recipe.ratings || recipe.ratings.length === 0) return 0;
      const sum = recipe.ratings.reduce((acc, r) => acc + r.rating, 0);
      return Math.round((sum / recipe.ratings.length) * 10) / 10;
    })();
  const totalRatings = recipe.totalRatings || recipe.ratings?.length || 0;

  return (
    <div
      className="recipe-card"
      onClick={handleCardClick}
      style={{ cursor: onRecipeClick ? "pointer" : "default" }}
    >
      <div className="card-image-wrap">
        <img
          src={imgSrc}
          alt={recipe.title}
          className="card-image"
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80";
          }}
        />
        <div className="card-overlay" />
        <div className="card-time-badge">
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          {recipe.time || "—"}
        </div>
      </div>

      <div className="card-body">
        <h3 className="card-title">{recipe.title}</h3>
        {recipe.ingredients && (
          <p className="card-ingredients">
            {Array.isArray(recipe.ingredients)
              ? recipe.ingredients.slice(0, 3).join(", ") +
                (recipe.ingredients.length > 3 ? "…" : "")
              : String(recipe.ingredients).slice(0, 60) + "…"}
          </p>
        )}

        {/* ── Star Rating Display ── */}
        <div className="card-rating">
          <div className="card-stars">
            {[1, 2, 3, 4, 5].map((s) => (
              <svg
                key={s}
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill={s <= Math.round(avgRating) ? "#F59E0B" : "none"}
                stroke={s <= Math.round(avgRating) ? "#F59E0B" : "#D4CEC8"}
                strokeWidth="2"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            ))}
          </div>
          {avgRating > 0 ? (
            <span className="card-rating-text">
              {avgRating.toFixed(1)}
              <span className="card-rating-count">({totalRatings})</span>
            </span>
          ) : (
            <span className="card-rating-text card-rating-none">
              No ratings yet
            </span>
          )}
        </div>

        <div className="card-footer">
          {mode === "my" ? (
            <div className="card-actions">
              <button
                className="action-btn edit-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(recipe);
                }}
                title="Edit"
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Edit
              </button>
              <button
                className="action-btn delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(recipe._id);
                }}
                title="Delete"
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14H6L5 6" />
                  <path d="M10 11v6" />
                  <path d="M14 11v6" />
                  <path d="M9 6V4h6v2" />
                </svg>
                Delete
              </button>
            </div>
          ) : (
            <button
              className={`fav-btn ${fav ? "active" : ""}`}
              onClick={handleFav}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill={fav ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
