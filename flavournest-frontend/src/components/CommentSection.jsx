import API_URL from "../api.js";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import "./CommentSection.css";

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}

export default function CommentSection({ recipeId }) {
  const { user, token } = useAuth();
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/api/recipes/${recipeId}/comments`)
      .then((r) => r.json())
      .then((data) => {
        setComments(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [recipeId]);

  const handleSubmit = async () => {
    if (!text.trim()) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/api/recipes/${recipeId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.message || "Failed to post comment");
      }
      const newComment = await res.json();
      setComments((prev) => [newComment, ...prev]);
      setText("");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    setDeletingId(commentId);
    try {
      const res = await fetch(
        `${API_URL}/api/recipes/${recipeId}/comments/${commentId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (res.ok) {
        setComments((prev) => prev.filter((c) => c._id !== commentId));
      }
    } catch {}
    setDeletingId(null);
  };

  const isOwn = (comment) => {
    if (!user) return false;
    return (
      comment.userId === (user._id || user.id) ||
      comment.userId?.toString() === (user._id || user.id)?.toString()
    );
  };

  const MAX = 1000;
  const nearLimit = text.length > MAX * 0.85;

  return (
    <div className="comment-section">
      {/* Header */}
      <div className="comment-header">
        <span className="comment-header-icon">💬</span>
        <h2 className="comment-header-title">Comments</h2>
        <span className="comment-count-badge">{comments.length}</span>
      </div>

      {/* Input area */}
      {user ? (
        <div className="comment-input-wrap">
          <div className="comment-avatar">{user.email[0].toUpperCase()}</div>
          <div className="comment-input-field-wrap">
            <textarea
              className="comment-textarea"
              placeholder="Share your thoughts on this recipe…"
              value={text}
              onChange={(e) => setText(e.target.value.slice(0, MAX))}
              rows={2}
              disabled={submitting}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
            />
            {error && <div className="comment-error">{error}</div>}
            <div className="comment-submit-row">
              <span
                className={`comment-char-count ${nearLimit ? "near-limit" : ""}`}
              >
                {text.length}/{MAX}
              </span>
              <button
                className="comment-submit-btn"
                onClick={handleSubmit}
                disabled={submitting || !text.trim()}
              >
                {submitting ? (
                  <span className="comment-submit-spinner" />
                ) : (
                  <>
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                    Post
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="comment-login-prompt">
          <strong onClick={() => {}}>Login</strong>
        </div>
      )}

      {/* Comment list */}
      {loading ? (
        <div className="comment-loading">
          <span className="comment-loading-dot" />
          <span className="comment-loading-dot" />
          <span className="comment-loading-dot" />
        </div>
      ) : comments.length === 0 ? (
        <div className="comment-empty">
          <span className="comment-empty-icon">🤫</span>
        </div>
      ) : (
        <div className="comment-list">
          {comments.map((comment) => {
            const own = isOwn(comment);
            return (
              <div key={comment._id} className="comment-item">
                <div className={`comment-item-avatar ${own ? "own" : ""}`}>
                  {comment.userEmail[0].toUpperCase()}
                </div>
                <div className="comment-item-body">
                  <div className="comment-item-top">
                    <span className="comment-item-email">
                      {comment.userEmail}
                    </span>
                    {own && <span className="comment-item-you">You</span>}
                    <span className="comment-item-time">
                      {timeAgo(comment.createdAt)}
                    </span>
                  </div>
                  <p className="comment-item-text">{comment.text}</p>
                  {own && (
                    <button
                      className="comment-delete-btn"
                      onClick={() => handleDelete(comment._id)}
                      disabled={deletingId === comment._id}
                      title="Delete comment"
                    >
                      {deletingId === comment._id ? (
                        <span style={{ fontSize: "0.7rem" }}>...</span>
                      ) : (
                        <svg
                          width="13"
                          height="13"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6l-1 14H6L5 6" />
                          <path d="M10 11v6M14 11v6M9 6V4h6v2" />
                        </svg>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
