const Recipes = require("../models/recipe");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "flavournest",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const upload = multer({ storage: storage });

const getRecipes = async (req, res) => {
  const { category, weather, mealTime } = req.query;
  const filter = {};
  if (category) filter.category = category;
  if (weather) filter.weather = { $in: [weather, "Any"] };
  if (mealTime) filter.mealTime = { $in: [mealTime, "Any"] };

  const recipes = await Recipes.find(filter);
  return res.json(recipes);
};

const getRecipe = async (req, res) => {
  const recipe = await Recipes.findById(req.params.id);
  res.json(recipe);
};

const getMoodRecipe = async (req, res) => {
  try {
    const { category, weather, mealTime } = req.query;
    const filter = {};
    if (category && category !== "Any") filter.category = category;
    if (weather && weather !== "Any")
      filter.weather = { $in: [weather, "Any"] };
    if (mealTime && mealTime !== "Any")
      filter.mealTime = { $in: [mealTime, "Any"] };

    const matches = await Recipes.find(filter);
    if (matches.length === 0) {
      const all = await Recipes.find();
      if (all.length === 0)
        return res.status(404).json({ message: "No recipes found" });
      const rand = all[Math.floor(Math.random() * all.length)];
      return res.json({ recipe: rand, matched: false });
    }
    const rand = matches[Math.floor(Math.random() * matches.length)];
    return res.json({ recipe: rand, matched: true, count: matches.length });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const addRecipe = async (req, res) => {
  try {
    const {
      title,
      ingredients,
      instructions,
      time,
      category,
      weather,
      mealTime,
    } = req.body;

    if (!title || !ingredients || !instructions) {
      return res
        .status(400)
        .json({ message: "Required fields can't be empty" });
    }

    const ingredientsArray = Array.isArray(ingredients)
      ? ingredients
      : ingredients
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);

    const newRecipe = await Recipes.create({
      title,
      ingredients: ingredientsArray,
      instructions,
      time,
      category: category || "Lunch",
      weather: weather || "Any",
      mealTime: mealTime || "Any",
      coverImage: req.file ? req.file.filename : "",
      createdBy: req.user.id,
    });
    return res.json(newRecipe);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const editRecipe = async (req, res) => {
  try {
    const {
      title,
      ingredients,
      instructions,
      time,
      category,
      weather,
      mealTime,
    } = req.body;
    let recipe = await Recipes.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    const ingredientsArray = Array.isArray(ingredients)
      ? ingredients
      : ingredients
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);

    let coverImage = req.file?.filename ? req.file.filename : recipe.coverImage;

    const updated = await Recipes.findByIdAndUpdate(
      req.params.id,
      {
        title,
        ingredients: ingredientsArray,
        instructions,
        time,
        category: category || recipe.category,
        weather: weather || recipe.weather,
        mealTime: mealTime || recipe.mealTime,
        coverImage,
      },
      { new: true },
    );
    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const deleteRecipe = async (req, res) => {
  try {
    await Recipes.deleteOne({ _id: req.params.id });
    res.json({ status: "ok" });
  } catch (err) {
    return res.status(400).json({ message: "error" });
  }
};

const rateRecipe = async (req, res) => {
  try {
    const { rating } = req.body;
    const userId = req.user.id;

    if (!rating || rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }

    const recipe = await Recipes.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    const existingIdx = recipe.ratings.findIndex(
      (r) => r.userId.toString() === userId,
    );

    if (existingIdx >= 0) {
      recipe.ratings[existingIdx].rating = rating;
    } else {
      recipe.ratings.push({ userId, rating });
    }

    await recipe.save();
    return res.json(recipe);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const removeRating = async (req, res) => {
  try {
    const userId = req.user.id;
    const recipe = await Recipes.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    recipe.ratings = recipe.ratings.filter(
      (r) => r.userId.toString() !== userId,
    );
    await recipe.save();
    return res.json(recipe);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getRecipes,
  getRecipe,
  getMoodRecipe,
  addRecipe,
  editRecipe,
  deleteRecipe,
  rateRecipe,
  removeRating,
  upload,
};
