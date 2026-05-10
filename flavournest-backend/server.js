const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const connectDb = require("./config/connectionDb");
const recipeRoutes = require("./routes/recipe");
const userRoutes = require("./routes/user");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/images", express.static(path.join(__dirname, "public/images")));

app.use("/api/recipes", recipeRoutes);
app.get("/health", (req, res) => res.json({ status: "ok" }));
app.use("/", userRoutes);

const PORT = process.env.PORT || 3000;

connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("DB connection failed:", err);
    process.exit(1);
  });
