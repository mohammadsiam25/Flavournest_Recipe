const Comment = require("../models/comment");

const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ recipeId: req.params.id }).sort({
      createdAt: -1,
    });
    return res.json(comments);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const newComment = await Comment.create({
      recipeId: req.params.id,
      userId: req.user.id,
      userEmail: req.user.email,
      text: text.trim(),
    });

    return res.status(201).json(newComment);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.userId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not allowed to delete this comment" });
    }

    await Comment.deleteOne({ _id: req.params.commentId });
    return res.json({ status: "ok" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = { getComments, addComment, deleteComment };
