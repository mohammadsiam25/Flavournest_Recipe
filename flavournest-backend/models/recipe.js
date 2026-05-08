const mongoose = require("mongoose");

const ratingSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
  },
  { _id: false },
);

const recipeSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    ingredients: {
      type: Array,
      required: true,
    },
    instructions: {
      type: String,
      required: true,
    },
    time: {
      type: String,
    },
    category: {
      type: String,
      enum: [
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
      ],
      default: "Lunch",
    },
    weather: {
      type: String,
      enum: ["Hot", "Cold", "Rainy", "Any"],
      default: "Any",
    },
    mealTime: {
      type: String,
      enum: ["Morning", "Afternoon", "Evening", "Night", "Any"],
      default: "Any",
    },
    coverImage: {
      type: String,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    ratings: {
      type: [ratingSchema],
      default: [],
    },
  },
  { timestamps: true },
);

recipeSchema.virtual("averageRating").get(function () {
  if (!this.ratings || this.ratings.length === 0) return 0;
  const sum = this.ratings.reduce((acc, r) => acc + r.rating, 0);
  return Math.round((sum / this.ratings.length) * 10) / 10;
});

recipeSchema.virtual("totalRatings").get(function () {
  return this.ratings ? this.ratings.length : 0;
});

recipeSchema.set("toJSON", { virtuals: true });
recipeSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Recipes", recipeSchema);
