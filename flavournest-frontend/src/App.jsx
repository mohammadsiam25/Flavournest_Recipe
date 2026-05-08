import { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AuthModal from "./components/AuthModal";
import HomePage from "./pages/HomePage";
import MyRecipePage from "./pages/MyRecipePage";
import FavouritesPage from "./pages/FavouritesPage";
import AddRecipePage from "./pages/AddRecipePage";
import RecipeDetailPage from "./pages/RecipeDetailPage";
import MoodPickerPage from "./pages/MoodPickerPage";

function AppInner() {
  const [currentPage, setCurrentPage] = useState("Home");
  const [showAuth, setShowAuth] = useState(false);
  const [editRecipe, setEditRecipe] = useState(null);
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);
  const { user } = useAuth();

  const handleAddClick = () => {
    if (!user) {
      setShowAuth(true);
      return;
    }
    setEditRecipe(null);
    setCurrentPage("Add");
  };

  const handleEdit = (recipe) => {
    setEditRecipe(recipe);
    setCurrentPage("Add");
  };

  const handleRecipeClick = (id) => {
    setSelectedRecipeId(id);
  };

  const handleBackFromDetail = () => {
    setSelectedRecipeId(null);
  };

  const handleNavChange = (page) => {
    setSelectedRecipeId(null);
    setCurrentPage(page);
  };

  const renderPage = () => {
    if (selectedRecipeId) {
      return (
        <RecipeDetailPage
          recipeId={selectedRecipeId}
          onBack={handleBackFromDetail}
        />
      );
    }

    switch (currentPage) {
      case "Home":
        return (
          <HomePage
            onAddRecipe={handleAddClick}
            onRecipeClick={handleRecipeClick}
          />
        );
      case "My Recipe":
        return (
          <MyRecipePage onEdit={handleEdit} onRecipeClick={handleRecipeClick} />
        );
      case "Favourites":
        return <FavouritesPage onRecipeClick={handleRecipeClick} />;
      case "Add":
        return (
          <AddRecipePage
            editRecipe={editRecipe}
            onSuccess={() => {
              setCurrentPage(editRecipe ? "My Recipe" : "Home");
              setEditRecipe(null);
            }}
          />
        );
      case "Mood":
        return <MoodPickerPage onRecipeClick={handleRecipeClick} />;
      default:
        return (
          <HomePage
            onAddRecipe={handleAddClick}
            onRecipeClick={handleRecipeClick}
          />
        );
    }
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <Navbar
        currentPage={currentPage}
        setCurrentPage={handleNavChange}
        onLoginClick={() => setShowAuth(true)}
      />
      <main style={{ flex: 1 }}>{renderPage()}</main>
      <Footer />
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}
