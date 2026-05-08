import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import RecipeCard from "../components/RecipeCard";
import "./MyRecipePage.css";

export default function MyRecipePage({ onEdit, onRecipeClick }) {
  const { user, token } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyRecipes = () => {
    if (!user) return;
    fetch(`/recipe`)
      .then((r) => r.json())
      .then((data) => {
        const mine = Array.isArray(data)
          ? data.filter((r) => r.createdBy === user._id)
          : [];
        setRecipes(mine);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchMyRecipes();
  }, [user]);

  const handleDelete = async (id) => {
    if (!confirm("Delete this recipe?")) return;
    await fetch(`/recipe/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setRecipes((prev) => prev.filter((r) => r._id !== id));
  };

  if (!user)
    return (
      <div className="myrecipe-page">
        <div className="login-prompt">
          <span className="prompt-icon">🔒</span>
          <h2>Login Required</h2>
          <p>Please log in to view and manage your recipes.</p>
        </div>
      </div>
    );

  return (
    <div className="myrecipe-page">
      <div className="myrecipe-header">
        <div className="myrecipe-header-content container">
          <div>
            <h1 className="myrecipe-title">My Recipes</h1>
            <p className="myrecipe-subtitle">
              Your personal recipe collection · {recipes.length}{" "}
              {recipes.length === 1 ? "recipe" : "recipes"}
            </p>
          </div>
          <div className="user-pill">
            <div className="user-pill-avatar">
              {user.email[0].toUpperCase()}
            </div>
            <span>{user.email}</span>
          </div>
        </div>
      </div>

      <div className="myrecipe-body container">
        {loading ? (
          <div className="recipes-grid">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton-card" />
            ))}
          </div>
        ) : recipes.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">👨‍🍳</span>
            <h3>No recipes yet</h3>
            <p>
              You haven't shared any recipes. Click "Share your recipe" to get
              started!
            </p>
          </div>
        ) : (
          <div className="recipes-grid">
            {recipes.map((recipe, i) => (
              <div key={recipe._id} style={{ animationDelay: `${i * 0.08}s` }}>
                <RecipeCard
                  recipe={recipe}
                  mode="my"
                  onEdit={onEdit}
                  onDelete={handleDelete}
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
