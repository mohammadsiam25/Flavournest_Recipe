import API_URL from "../api.js";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import "./AddRecipePage.css";

const CATEGORIES = [
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

const WEATHERS = ["Any", "Hot", "Cold", "Rainy"];
const MEAL_TIMES = ["Any", "Morning", "Afternoon", "Evening", "Night"];

export default function AddRecipePage({ editRecipe, onSuccess }) {
  const { token } = useAuth();
  const [form, setForm] = useState({
    title: "",
    ingredients: "",
    instructions: "",
    time: "",
    category: "Lunch",
    weather: "Any",
    mealTime: "Any",
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (editRecipe) {
      setForm({
        title: editRecipe.title || "",
        ingredients: Array.isArray(editRecipe.ingredients)
          ? editRecipe.ingredients.join(", ")
          : editRecipe.ingredients || "",
        instructions: editRecipe.instructions || "",
        time: editRecipe.time || "",
        category: editRecipe.category || "Lunch",
        weather: editRecipe.weather || "Any",
        mealTime: editRecipe.mealTime || "Any",
      });
      if (editRecipe.coverImage) {
        setPreview(`/images/${editRecipe.coverImage}`);
      }
    }
  }, [editRecipe]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("ingredients", form.ingredients);
    fd.append("instructions", form.instructions);
    fd.append("time", form.time);
    fd.append("category", form.category);
    fd.append("weather", form.weather);
    fd.append("mealTime", form.mealTime);
    if (file) fd.append("file", file);

    const url = editRecipe
      ? `${API_URL}/recipe/${editRecipe._id}`
      : `${API_URL}/recipe`;
    const method = editRecipe ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.message || "Failed to save recipe");
      }

      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-page">
      <div className="add-container">
        <div className="add-header">
          <h1 className="add-title">
            {editRecipe ? "Edit Recipe" : "Share a Recipe"}
          </h1>
          <p className="add-subtitle">
            {editRecipe
              ? "Update your recipe details below"
              : "Share your culinary creation with the community"}
          </p>
        </div>

        <form className="add-form" onSubmit={handleSubmit}>
          {error && <div className="form-error">{error}</div>}

          {/* Cover Image */}
          <div className="form-group">
            <label className="form-label">Cover Image</label>
            <div
              className="image-upload-zone"
              onClick={() =>
                document.getElementById("recipe-img-input").click()
              }
            >
              {preview ? (
                <img src={preview} alt="Preview" className="image-preview" />
              ) : (
                <div className="image-placeholder">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  <span>Click to upload photo</span>
                  <small>JPG, PNG recommended</small>
                </div>
              )}
            </div>
            <input
              id="recipe-img-input"
              type="file"
              accept="image/*"
              onChange={handleFile}
              style={{ display: "none" }}
            />
          </div>

          {/* Title */}
          <div className="form-group">
            <label className="form-label">Recipe Title *</label>
            <input
              className="form-input"
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Creamy Butter Chicken"
              required
            />
          </div>

          {/* Category + Weather + MealTime row */}
          <div className="form-row-3">
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-input"
                name="category"
                value={form.category}
                onChange={handleChange}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Best Weather</label>
              <select
                className="form-input"
                name="weather"
                value={form.weather}
                onChange={handleChange}
              >
                {WEATHERS.map((w) => (
                  <option key={w} value={w}>
                    {w}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Meal Time</label>
              <select
                className="form-input"
                name="mealTime"
                value={form.mealTime}
                onChange={handleChange}
              >
                {MEAL_TIMES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Cook Time */}
          <div className="form-group">
            <label className="form-label">Cooking Time</label>
            <input
              className="form-input"
              type="text"
              name="time"
              value={form.time}
              onChange={handleChange}
              placeholder="e.g. 30 min, 1 hour"
            />
          </div>

          {/* Ingredients */}
          <div className="form-group">
            <label className="form-label">Ingredients *</label>
            <textarea
              className="form-textarea"
              name="ingredients"
              value={form.ingredients}
              onChange={handleChange}
              placeholder="Enter ingredients separated by commas&#10;e.g. 2 cups flour, 1 tsp salt, 3 eggs"
              rows={4}
              required
            />
            <small className="form-hint">
              Separate each ingredient with a comma
            </small>
          </div>

          {/* Instructions */}
          <div className="form-group">
            <label className="form-label">Instructions *</label>
            <textarea
              className="form-textarea"
              name="instructions"
              value={form.instructions}
              onChange={handleChange}
              placeholder="Step 1: Preheat the oven to 180°C...&#10;Step 2: Mix the dry ingredients..."
              rows={7}
              required
            />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? (
              <span className="btn-loading">
                <span className="loading-dot" />
                <span className="loading-dot" />
                <span className="loading-dot" />
              </span>
            ) : editRecipe ? (
              "Update Recipe"
            ) : (
              "Share Recipe"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
