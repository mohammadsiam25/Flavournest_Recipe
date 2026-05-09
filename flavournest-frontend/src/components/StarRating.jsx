import API_URL from "../api.js";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function StarRating({ recipe, onRated }) {
  const { user, token } = useAuth();
  const [hoveredStar, setHoveredStar] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const myRating = user
    ? recipe.ratings?.find((r) => r.userId === user._id || r.userId === user.id)
        ?.rating || 0
    : 0;

  const avgRating = recipe.averageRating || 0;
  const totalRatings = recipe.ratings?.length || 0;

  const handleRate = async (star) => {
    if (!user) {
      setMessage("Please login to rate recipes");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/recipes/${recipe._id}/rate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rating: star }),
      });

      if (res.ok) {
        const updated = await res.json();
        setMessage(myRating === star ? "Rating updated!" : "Rated!");
        setTimeout(() => setMessage(""), 2000);
        if (onRated) onRated(updated);
      }
    } catch (err) {
      setMessage("Failed to save rating");
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  const displayStars = hoveredStar || myRating;

  return (
    <div className="star-rating-wrap">
      {/* Average display */}
      <div className="avg-rating-row">
        <div className="avg-stars">
          {[1, 2, 3, 4, 5].map((s) => (
            <svg
              key={s}
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill={s <= Math.round(avgRating) ? "#F59E0B" : "none"}
              stroke="#F59E0B"
              strokeWidth="2"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          ))}
        </div>
        <span className="avg-number">
          {avgRating > 0 ? avgRating.toFixed(1) : "No ratings"}
        </span>
        {totalRatings > 0 && (
          <span className="total-ratings">({totalRatings})</span>
        )}
      </div>

      {/* Interactive rating */}
      <div className="interactive-stars">
        <span className="rate-label">
          {user
            ? myRating > 0
              ? "Your rating:"
              : "Rate this:"
            : "Login to rate:"}
        </span>
        <div className="stars-input" onMouseLeave={() => setHoveredStar(0)}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              className="star-btn"
              onMouseEnter={() => setHoveredStar(star)}
              onClick={() => handleRate(star)}
              disabled={loading}
              title={`Rate ${star} star${star > 1 ? "s" : ""}`}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill={star <= displayStars ? "#F59E0B" : "none"}
                stroke={star <= displayStars ? "#F59E0B" : "#D4CEC8"}
                strokeWidth="2"
                style={{
                  transition: "all 0.12s",
                  transform: star <= displayStars ? "scale(1.15)" : "scale(1)",
                }}
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </button>
          ))}
        </div>
        {myRating > 0 && <span className="my-rating-badge">{myRating}★</span>}
      </div>

      {message && <div className="rating-message">{message}</div>}
    </div>
  );
}
