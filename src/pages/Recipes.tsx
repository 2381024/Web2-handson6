import { useState, useEffect } from "react";

interface Recipe {
  id: number;
  name: string;
  ingredients: string;
}

const fetchRecipes = async () => {
  const response = await fetch("https://dummyjson.com/recipes");
  if (!response.ok) throw new Error("Failed to fetch recipes");
  return response.json();
};

const addRecipeToAPI = async (name: string, ingredients: string) => {
  const response = await fetch("https://dummyjson.com/recipes/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, ingredients }),
  });
  if (!response.ok) throw new Error("Failed to add recipe");
  return response.json();
};

const updateRecipeInAPI = async (id: number, name: string, ingredients: string) => {
  const response = await fetch(`https://dummyjson.com/recipes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, ingredients }),
  });
  if (!response.ok) throw new Error("Failed to update recipe");
  return response.json();
};

const deleteRecipeFromAPI = async (id: number) => {
  const response = await fetch(`https://dummyjson.com/recipes/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete recipe");
};

const Recipes = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setIsLoading(true);
    fetchRecipes()
      .then((data) => setRecipes(data.recipes))
      .catch(() => setError("Failed to fetch recipes."))
      .finally(() => setIsLoading(false));
  }, []);

  const addRecipe = async () => {
    const name = prompt("Enter recipe name:");
    const ingredients = prompt("Enter ingredients:");
    if (!name || !ingredients) return;
    setIsLoading(true);
    try {
      const newRecipe = await addRecipeToAPI(name, ingredients);
      setRecipes((prev) => [newRecipe, ...prev]);
    } catch {
      setError("Failed to add recipe.");
    } finally {
      setIsLoading(false);
    }
  };

  const updateRecipe = async (id: number, currentName: string, currentIngredients: string) => {
    const name = prompt("Edit recipe name:", currentName);
    const ingredients = prompt("Edit ingredients:", currentIngredients);
    if (!name || !ingredients) return;
    setIsLoading(true);
    try {
      const updatedRecipe = await updateRecipeInAPI(id, name, ingredients);
      setRecipes((prev) => prev.map((recipe) => (recipe.id === id ? updatedRecipe : recipe)));
    } catch {
      setError("Failed to update recipe.");
    } finally {
      setIsLoading(false);
    }
  };

  const removeRecipe = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this recipe?")) return;
    setIsLoading(true);
    try {
      await deleteRecipeFromAPI(id);
      setRecipes((prev) => prev.filter((recipe) => recipe.id !== id));
    } catch {
      setError("Failed to delete recipe.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-20">
      <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">Recipes</h2>
      {error && <p className="text-red-500 text-center">{error}</p>}
      <div className="mb-4 flex justify-center">
        <button onClick={addRecipe} className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600" disabled={isLoading}>
          {isLoading ? "Adding..." : "Add Recipe"}
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading
          ? Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-gray-200 p-4 rounded shadow animate-pulse">
                <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-5/6"></div>
              </div>
            ))
          : recipes.map((recipe) => (
              <div key={recipe.id} className="bg-white p-4 rounded shadow">
                <h3 className="font-bold text-lg">{recipe.name}</h3>
                <p className="text-gray-700">{recipe.ingredients}</p>
                <div className="flex justify-end space-x-2 mt-2">
                  <button onClick={() => updateRecipe(recipe.id, recipe.name, recipe.ingredients)} className="text-yellow-500">✎</button>
                  <button onClick={() => removeRecipe(recipe.id)} className="text-red-500">✖</button>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
};

export default Recipes;
