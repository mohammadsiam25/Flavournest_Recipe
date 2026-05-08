import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

export default function Navbar({ currentPage, setCurrentPage, onLoginClick }) {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const navItems = ["Home", "My Recipe", "Favourites"];

  const handleNav = (page) => {
    setCurrentPage(page);
    setMenuOpen(false);
    setProfileOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="navbar-brand" onClick={() => handleNav("Home")}>
          <span className="brand-icon">🍳</span>
          <span className="brand-text">Flavour Nest</span>
        </div>

        <div className={`navbar-links ${menuOpen ? "open" : ""}`}>
          {navItems.map((item) => (
            <button
              key={item}
              className={`nav-link ${currentPage === item ? "active" : ""}`}
              onClick={() => handleNav(item)}
            >
              {item}
            </button>
          ))}

          {/* Mood Finder nav link */}
          <button
            className={`nav-link ${currentPage === "Mood" ? "active" : ""}`}
            onClick={() => handleNav("Mood")}
          >
            🎯 Mood Pick
          </button>

          {user ? (
            <div className="nav-profile-wrap" ref={profileRef}>
              <button
                className="profile-icon-btn"
                onClick={() => setProfileOpen((p) => !p)}
                title={user.email}
                aria-label="Profile menu"
              >
                <div className="user-avatar">{user.email[0].toUpperCase()}</div>
                <svg
                  className={`profile-chevron ${profileOpen ? "open" : ""}`}
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {profileOpen && (
                <div className="profile-dropdown">
                  <div className="profile-dropdown-header">
                    <div className="profile-dropdown-avatar">
                      {user.email[0].toUpperCase()}
                    </div>
                    <div className="profile-dropdown-info">
                      <span className="profile-dropdown-label">
                        Signed in as
                      </span>
                      <span className="profile-dropdown-email">
                        {user.email}
                      </span>
                    </div>
                  </div>
                  <div className="profile-dropdown-divider" />
                  <button
                    className="profile-dropdown-item"
                    onClick={() => {
                      handleNav("My Recipe");
                    }}
                  >
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                    My Recipes
                  </button>
                  <button
                    className="profile-dropdown-item"
                    onClick={() => {
                      handleNav("Favourites");
                    }}
                  >
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                    Favourites
                  </button>
                  <div className="profile-dropdown-divider" />
                  <button
                    className="profile-dropdown-item logout-item"
                    onClick={() => {
                      logout();
                      setProfileOpen(false);
                    }}
                  >
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button className="btn-login" onClick={onLoginClick}>
              Login
            </button>
          )}
        </div>

        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
}
