import API_URL from "../api.js";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./AuthModal.css";

export default function AuthModal({ onClose }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      const endpoint =
        mode === "login" ? `${API_URL}/login` : `${API_URL}/signUp`;
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.token) {
        login(data.user, data.token);
        onClose();
      } else setError(data.error || data.message || "Something went wrong");
    } catch {
      setError("Network error. Check if the server is running.");
    }
    setLoading(false);
  };

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-card">
        <button className="modal-close" onClick={onClose}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="modal-header">
          <div className="modal-icon">🍽️</div>
          <h2 className="modal-title">
            {mode === "login" ? "Welcome back" : "Join Flavour Nest"}
          </h2>
          <p className="modal-subtitle">
            {mode === "login"
              ? "Sign in to your account"
              : "Create your free account"}
          </p>
        </div>

        <div className="modal-tabs">
          <button
            className={`tab-btn ${mode === "login" ? "active" : ""}`}
            onClick={() => {
              setMode("login");
              setError("");
            }}
          >
            Login
          </button>
          <button
            className={`tab-btn ${mode === "signup" ? "active" : ""}`}
            onClick={() => {
              setMode("signup");
              setError("");
            }}
          >
            Sign Up
          </button>
        </div>

        <div className="modal-form">
          {error && <div className="form-error">{error}</div>}

          {/* Email Field */}
          <div className="form-group">
            <label className="form-label">Email</label>
            <div className="input-wrap">
              <svg
                className="input-icon"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <input
                className="form-input"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-wrap">
              <svg
                className="input-icon"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input
                className="form-input"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                autoComplete={
                  mode === "login" ? "current-password" : "new-password"
                }
              />
              {/* Show/Hide Password Toggle */}
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  /* Eye-off icon */
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  /* Eye icon */
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            className="btn-submit"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <span className="spinner" />
            ) : mode === "login" ? (
              "Sign In"
            ) : (
              "Create Account"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
