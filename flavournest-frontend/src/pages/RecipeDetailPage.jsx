import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import StarRating from "../components/StarRating";
import "../components/StarRating.css";

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
};

const WEATHER_ICONS = { Hot: "☀️", Cold: "❄️", Rainy: "🌧️", Any: "🌤️" };
const TIME_ICONS = {
  Morning: "🌅",
  Afternoon: "☀️",
  Evening: "🌆",
  Night: "🌙",
  Any: "🕐",
};

export default function RecipeDetailPage({ recipeId, onBack }) {
  const { user, token } = useAuth();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [creator, setCreator] = useState(null);
  const [fav, setFav] = useState(false);

  useEffect(() => {
    fetch(`/recipe/${recipeId}`)
      .then((r) => r.json())
      .then(async (data) => {
        setRecipe(data);
        setLoading(false);
        if (data.createdBy) {
          try {
            const userRes = await fetch(`/user/${data.createdBy}`);
            const userData = await userRes.json();
            setCreator(userData);
          } catch {}
        }
      })
      .catch(() => setLoading(false));

    const favs = JSON.parse(localStorage.getItem("fn_favourites") || "[]");
    setFav(favs.includes(recipeId));
  }, [recipeId]);

  const toggleFav = () => {
    const favs = JSON.parse(localStorage.getItem("fn_favourites") || "[]");
    const newFavs = fav
      ? favs.filter((id) => id !== recipeId)
      : [...favs, recipeId];
    localStorage.setItem("fn_favourites", JSON.stringify(newFavs));
    setFav(!fav);
  };

  const handleRated = (updatedRecipe) => {
    setRecipe(updatedRecipe);
  };

  const ingredientList = Array.isArray(recipe?.ingredients)
    ? recipe.ingredients
    : (recipe?.ingredients || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

  const imgSrc = recipe?.coverImage
    ? `/images/${recipe.coverImage}`
    : "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=85";

  if (loading)
    return (
      <div style={styles.loadWrap}>
        <div style={styles.spinner} />
      </div>
    );

  if (!recipe)
    return (
      <div style={styles.notFound}>
        <span style={{ fontSize: "3rem" }}>🍽️</span>
        <h2 style={styles.nfTitle}>Recipe not found</h2>
        <button style={styles.backBtn} onClick={onBack}>
          ← Go back
        </button>
      </div>
    );

  return (
    <div style={styles.page}>
      {/* Hero Image */}
      <div style={styles.heroWrap}>
        <img
          src={imgSrc}
          alt={recipe.title}
          style={styles.heroImg}
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=85";
          }}
        />
        <div style={styles.heroOverlay} />

        <button style={styles.backFab} onClick={onBack}>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <button
          style={{ ...styles.favFab, ...(fav ? styles.favActive : {}) }}
          onClick={toggleFav}
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

        <div style={styles.heroTextWrap}>
          <div style={styles.heroBadgesRow}>
            {recipe.category && (
              <span style={styles.heroBadge}>
                {CATEGORY_EMOJIS[recipe.category] || "🍴"} {recipe.category}
              </span>
            )}
            {recipe.weather && recipe.weather !== "Any" && (
              <span style={styles.heroBadge}>
                {WEATHER_ICONS[recipe.weather]} {recipe.weather}
              </span>
            )}
            {recipe.mealTime && recipe.mealTime !== "Any" && (
              <span style={styles.heroBadge}>
                {TIME_ICONS[recipe.mealTime]} {recipe.mealTime}
              </span>
            )}
          </div>
          <h1 style={styles.heroTitle}>{recipe.title}</h1>
          {recipe.time && (
            <span style={styles.heroTimeBadge}>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                style={{ marginRight: 5 }}
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              {recipe.time}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div style={styles.content}>
        {/* Creator card */}
        {creator && (
          <div style={styles.creatorCard}>
            <div style={styles.creatorAvatar}>
              {creator.email[0].toUpperCase()}
            </div>
            <div>
              <div style={styles.creatorLabel}>Recipe by</div>
              <div style={styles.creatorEmail}>{creator.email}</div>
            </div>
            <div style={styles.creatorBadge}>Chef</div>
          </div>
        )}

        {/* Rating Section */}
        <div style={{ marginBottom: "1.5rem" }}>
          <StarRating recipe={recipe} onRated={handleRated} />
        </div>

        {/* Two column layout */}
        <div style={styles.twoCol}>
          {/* Ingredients */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <div style={styles.cardHeaderIcon}>🥘</div>
              <h2 style={styles.cardTitle}>Ingredients</h2>
            </div>
            <ul style={styles.ingList}>
              {ingredientList.map((ing, i) => (
                <li key={i} style={styles.ingItem}>
                  <span style={styles.ingDot} />
                  <span style={styles.ingText}>{ing}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Instructions */}
          <div style={{ ...styles.card, flex: 2 }}>
            <div style={styles.cardHeader}>
              <div style={styles.cardHeaderIcon}>📋</div>
              <h2 style={styles.cardTitle}>Instructions</h2>
            </div>
            <div style={styles.instructions}>{recipe.instructions}</div>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
          <button style={styles.backBtnBottom} onClick={onBack}>
            ← Back to Recipes
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "calc(100vh - 72px)",
    background: "#FAF6F0",
    fontFamily: "'DM Sans', sans-serif",
  },
  loadWrap: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "60vh",
  },
  spinner: {
    width: 40,
    height: 40,
    border: "3px solid #F2EBE0",
    borderTopColor: "#C4622D",
    borderRadius: "50%",
    animation: "spin 0.7s linear infinite",
  },
  notFound: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "1rem",
    minHeight: "60vh",
    textAlign: "center",
  },
  nfTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "1.5rem",
    color: "#2C2C2C",
  },
  heroWrap: { position: "relative", height: 420, overflow: "hidden" },
  heroImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  heroOverlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(to top, rgba(20,15,10,0.85) 0%, rgba(20,15,10,0.2) 50%, transparent 100%)",
  },
  backFab: {
    position: "absolute",
    top: 20,
    left: 20,
    background: "rgba(250,246,240,0.9)",
    backdropFilter: "blur(10px)",
    border: "none",
    borderRadius: "50%",
    width: 42,
    height: 42,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    color: "#2C2C2C",
    boxShadow: "0 2px 12px rgba(0,0,0,0.2)",
    transition: "all 0.2s",
  },
  favFab: {
    position: "absolute",
    top: 20,
    right: 20,
    background: "rgba(250,246,240,0.9)",
    backdropFilter: "blur(10px)",
    border: "none",
    borderRadius: "50%",
    width: 42,
    height: 42,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    color: "#D4CEC8",
    boxShadow: "0 2px 12px rgba(0,0,0,0.2)",
    transition: "all 0.2s",
  },
  favActive: { color: "#E53E3E" },
  heroTextWrap: {
    position: "absolute",
    bottom: 28,
    left: 0,
    right: 0,
    padding: "0 2rem",
  },
  heroBadgesRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.4rem",
    marginBottom: "0.6rem",
  },
  heroBadge: {
    display: "inline-flex",
    alignItems: "center",
    background: "rgba(250,246,240,0.18)",
    backdropFilter: "blur(8px)",
    border: "1px solid rgba(255,255,255,0.25)",
    color: "white",
    fontSize: "0.75rem",
    fontWeight: 600,
    padding: "0.25rem 0.7rem",
    borderRadius: "20px",
  },
  heroTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
    fontWeight: 700,
    color: "white",
    marginBottom: "0.6rem",
    textShadow: "0 2px 12px rgba(0,0,0,0.4)",
    lineHeight: 1.2,
  },
  heroTimeBadge: {
    display: "inline-flex",
    alignItems: "center",
    background: "rgba(250,246,240,0.18)",
    backdropFilter: "blur(8px)",
    border: "1px solid rgba(255,255,255,0.3)",
    color: "white",
    fontSize: "0.85rem",
    fontWeight: 600,
    padding: "0.35rem 0.9rem",
    borderRadius: "20px",
  },
  content: { maxWidth: 1100, margin: "0 auto", padding: "2.5rem 2rem 4rem" },
  creatorCard: {
    display: "flex",
    alignItems: "center",
    gap: "0.9rem",
    background: "#FFFDF9",
    border: "1px solid rgba(212,206,200,0.5)",
    borderRadius: 14,
    padding: "1rem 1.4rem",
    marginBottom: "1.5rem",
    boxShadow: "0 2px 8px rgba(44,44,44,0.06)",
  },
  creatorAvatar: {
    width: 44,
    height: 44,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #C4622D, #E8855A)",
    color: "white",
    fontWeight: 700,
    fontSize: "1.1rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  creatorLabel: { fontSize: "0.75rem", color: "#8B8178", marginBottom: 2 },
  creatorEmail: { fontSize: "0.95rem", fontWeight: 600, color: "#2C2C2C" },
  creatorBadge: {
    marginLeft: "auto",
    background: "#EBF3EC",
    color: "#7A9E7E",
    fontSize: "0.75rem",
    fontWeight: 700,
    padding: "0.3rem 0.8rem",
    borderRadius: 20,
    letterSpacing: "0.05em",
    textTransform: "uppercase",
  },
  twoCol: {
    display: "flex",
    gap: "1.5rem",
    alignItems: "flex-start",
    flexWrap: "wrap",
  },
  card: {
    flex: 1,
    minWidth: 240,
    background: "#FFFDF9",
    border: "1px solid rgba(212,206,200,0.5)",
    borderRadius: 16,
    padding: "1.5rem",
    boxShadow: "0 2px 8px rgba(44,44,44,0.06)",
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: "0.6rem",
    marginBottom: "1.2rem",
    paddingBottom: "0.9rem",
    borderBottom: "1px solid #F2EBE0",
  },
  cardHeaderIcon: { fontSize: "1.2rem" },
  cardTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "1.15rem",
    fontWeight: 700,
    color: "#2C2C2C",
  },
  ingList: {
    listStyle: "none",
    display: "flex",
    flexDirection: "column",
    gap: "0.65rem",
  },
  ingItem: { display: "flex", alignItems: "flex-start", gap: "0.75rem" },
  ingDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: "#C4622D",
    flexShrink: 0,
    marginTop: 6,
  },
  ingText: { fontSize: "0.9rem", color: "#4A4A4A", lineHeight: 1.5 },
  instructions: {
    fontSize: "0.92rem",
    color: "#4A4A4A",
    lineHeight: 1.85,
    whiteSpace: "pre-wrap",
  },
  backBtn: {
    background: "#C4622D",
    color: "white",
    border: "none",
    borderRadius: 8,
    padding: "0.7rem 1.5rem",
    fontSize: "0.95rem",
    fontWeight: 600,
    cursor: "pointer",
  },
  backBtnBottom: {
    background: "none",
    border: "1.5px solid #D4CEC8",
    color: "#8B8178",
    borderRadius: 20,
    padding: "0.65rem 1.8rem",
    fontSize: "0.9rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s",
    fontFamily: "'DM Sans', sans-serif",
  },
};
