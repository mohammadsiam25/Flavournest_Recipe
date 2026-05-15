const express = require("express");
const {
  getRecipes,
  getRecipe,
  getMoodRecipe,
  addRecipe,
  editRecipe,
  deleteRecipe,
  rateRecipe,
  removeRating,
  upload,
} = require("../controller/recipe");
const {
  getComments,
  addComment,
  deleteComment,
} = require("../controller/comment");
const verifyToken = require("../middleware/auth");
const router = express.Router();

router.get("/mood-pick", getMoodRecipe);
router.get("/", getRecipes);
router.get("/:id", getRecipe);
router.post("/", upload.single("file"), verifyToken, addRecipe);
router.put("/:id", upload.single("file"), verifyToken, editRecipe);
router.delete("/:id", verifyToken, deleteRecipe);
router.post("/:id/rate", verifyToken, rateRecipe);
router.delete("/:id/rate", verifyToken, removeRating);

router.get("/:id/comments", getComments);
router.post("/:id/comments", verifyToken, addComment);
router.delete("/:id/comments/:commentId", verifyToken, deleteComment);

module.exports = router;
