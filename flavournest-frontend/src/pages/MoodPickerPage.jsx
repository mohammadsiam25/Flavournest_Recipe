import API_URL from "../api.js";
import { useState } from "react";
import "./MoodPickerPage.css";

const CATEGORIES = [
  "Any",
  "Breakfast",
  "Lunch",
  "Dinner",
  "Snacks",
  "Desserts",
  "Drinks",
  "Vegetarian",
  "Vegan",
  "Seafood",
  "Fast Food",
  "Soup",
  "Salad",
];

const WEATHERS = [
  { value: "Any", label: "Any Weather", emoji: "🌤️" },
  { value: "Hot", label: "Hot & Sunny", emoji: "☀️" },
  { value: "Cold", label: "Cold & Chilly", emoji: "❄️" },
  { value: "Rainy", label: "Rainy Day", emoji: "🌧️" },
];

const MEAL_TIMES = [
  { value: "Any", label: "Anytime", emoji: "🕐" },
  { value: "Morning", label: "Morning", emoji: "🌅" },
  { value: "Afternoon", label: "Afternoon", emoji: "☀️" },
  { value: "Evening", label: "Evening", emoji: "🌆" },
  { value: "Night", label: "Night", emoji: "🌙" },
];

const CATEGORY_EMOJIS = {
  Breakfast: "🍳",
  Lunch: "🥗",
  Dinner: "🍽️",
  Snacks: "🍿",
  Desserts: "🍰",
  Drinks: "🥤",
  Vegetarian: "🥦",
  Vegan: "🌿",
  Seafood: "🦐",
  "Fast Food": "🍔",
  Soup: "🍲",
  Salad: "🥙",
  Any: "🎲",
};

export default function MoodPickerPage({ onRecipeClick }) {
  const [category, setCategory] = useState("Any");
  const [weather, setWeather] = useState("Any");
  const [mealTime, setMealTime] = useState("Any");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    setError("");
    setResult(null);
    setSearched(true);

    try {
      const params = new URLSearchParams();
      if (category !== "Any") params.set("category", category);
      if (weather !== "Any") params.set("weather", weather);
      if (mealTime !== "Any") params.set("mealTime", mealTime);

      const res = await fetch(
        `${API_URL}/api/recipes/mood-pick?${params.toString()}`,
      );
      if (!res.ok) throw new Error("No recipes found");
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError("No matching recipes found. Try different filters!");
    } finally {
      setLoading(false);
    }
  };

  const handleTryAgain = () => {
    handleSearch();
  };

  const imgSrc = result?.recipe?.coverImage
    ? result.recipe.coverImage
    : "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80";

  return (
    <div className="mood-page">
      {/* Header */}
      <div className="mood-hero">
        <div className="mood-hero-inner">
          <span className="mood-badge">✨ Mood-Based Discovery</span>
          <h1 className="mood-title">What Should I Eat?</h1>
          <p className="mood-desc">
            Tell us your vibe — we'll find the perfect recipe for your mood,
            weather, and time of day.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mood-container">
        <div className="mood-card">
          <h2 className="mood-section-title">Set Your Mood</h2>

          {/* Category */}
          <div className="filter-group">
            <label className="filter-label">📂 Food Category</label>
            <div className="chip-grid">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  className={`chip ${category === c ? "chip-active" : ""}`}
                  onClick={() => setCategory(c)}
                >
                  {CATEGORY_EMOJIS[c] || "🍴"} {c}
                </button>
              ))}
            </div>
          </div>

          {/* Weather */}
          <div className="filter-group">
            <label className="filter-label">🌤️ Current Weather</label>
            <div className="chip-grid">
              {WEATHERS.map((w) => (
                <button
                  key={w.value}
                  className={`chip ${weather === w.value ? "chip-active" : ""}`}
                  onClick={() => setWeather(w.value)}
                >
                  {w.emoji} {w.label}
                </button>
              ))}
            </div>
          </div>

          {/* Meal Time */}
          <div className="filter-group">
            <label className="filter-label">⏰ Time of Day</label>
            <div className="chip-grid">
              {MEAL_TIMES.map((t) => (
                <button
                  key={t.value}
                  className={`chip ${mealTime === t.value ? "chip-active" : ""}`}
                  onClick={() => setMealTime(t.value)}
                >
                  {t.emoji} {t.label}
                </button>
              ))}
            </div>
          </div>

          <button
            className="mood-find-btn"
            onClick={handleSearch}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="btn-spinner" />
                Finding your perfect recipe...
              </>
            ) : (
              <>🎯 Find My Recipe</>
            )}
          </button>
        </div>

        {/* Result */}
        {searched && !loading && (
          <div className="mood-result-wrap">
            {error ? (
              <div className="mood-empty">
                <span className="mood-empty-icon">🥘</span>
                <p>{error}</p>
                <button
                  className="mood-retry-btn"
                  onClick={() => setSearched(false)}
                >
                  Reset Filters
                </button>
              </div>
            ) : result ? (
              <div className="mood-result-card">
                <div className="result-badge-row">
                  <span className="result-match-badge">
                    {result.matched
                      ? `✅ Perfect Match! (${result.count} recipes found)`
                      : "🔀 Random Pick (no exact match — showing closest)"}
                  </span>
                </div>

                <div
                  className="result-inner"
                  onClick={() =>
                    onRecipeClick && onRecipeClick(result.recipe._id)
                  }
                >
                  <div className="result-img-wrap">
                    <img
                      src={imgSrc}
                      alt={result.recipe.title}
                      className="result-img"
                      onError={(e) => {
                        e.target.src =
                          "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80";
                      }}
                    />
                    <div className="result-img-overlay" />
                  </div>

                  <div className="result-info">
                    <div className="result-tags">
                      {result.recipe.category && (
                        <span className="result-tag">
                          {CATEGORY_EMOJIS[result.recipe.category]}{" "}
                          {result.recipe.category}
                        </span>
                      )}
                      {result.recipe.weather &&
                        result.recipe.weather !== "Any" && (
                          <span className="result-tag">
                            {
                              WEATHERS.find(
                                (w) => w.value === result.recipe.weather,
                              )?.emoji
                            }{" "}
                            {result.recipe.weather}
                          </span>
                        )}
                      {result.recipe.mealTime &&
                        result.recipe.mealTime !== "Any" && (
                          <span className="result-tag">
                            {
                              MEAL_TIMES.find(
                                (t) => t.value === result.recipe.mealTime,
                              )?.emoji
                            }{" "}
                            {result.recipe.mealTime}
                          </span>
                        )}
                      {result.recipe.time && (
                        <span className="result-tag">
                          ⏱ {result.recipe.time}
                        </span>
                      )}
                    </div>

                    <h2 className="result-title">{result.recipe.title}</h2>

                    {result.recipe.ingredients && (
                      <p className="result-ingredients">
                        <strong>Ingredients:</strong>{" "}
                        {Array.isArray(result.recipe.ingredients)
                          ? result.recipe.ingredients.slice(0, 4).join(", ") +
                            (result.recipe.ingredients.length > 4 ? "…" : "")
                          : String(result.recipe.ingredients).slice(0, 80) +
                            "…"}
                      </p>
                    )}

                    <div className="result-actions">
                      <button
                        className="view-recipe-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onRecipeClick) onRecipeClick(result.recipe._id);
                        }}
                      >
                        View Full Recipe →
                      </button>
                      <button
                        className="try-again-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTryAgain();
                        }}
                      >
                        🔀 Try Another
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
