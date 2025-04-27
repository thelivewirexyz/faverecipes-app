import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-database.js";

const firebaseConfig = {
  databaseURL:
    "https://fave-recipes-default-rtdb.europe-west1.firebasedatabase.app/",
};
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const referenceInDb = ref(database, "recipes");

const addBtn = document.getElementById("add-btn");
const categoryList = document.getElementById("category-list");
const filterInput = document.getElementById("filter");
const name = document.getElementById("name");
const source = document.getElementById("source");
const category = document.getElementById("category");
const chef = document.getElementById("chef");
const newRecipeBtn = document.getElementById("new-recipe");
const recipeForm = document.getElementById("recipe-form");

let recipes = []; // <-- uncomment this!

let categories = ["soups", "sauce", "smoothies", "pasta", "pastries"];

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function renderCat(cat) {
  let categoryListItems = "";
  for (let i = 0; i < cat.length; i++) {
    let category = cat[i];
    categoryListItems += `<h3>${capitalizeFirstLetter(category)}</h3>
    <ul class="recipe-${category}">
    </ul>`;
  }
  categoryList.innerHTML = categoryListItems;
}

function renderRecipes() {
  // Clear all recipe lists
  let recipeLists = document.querySelectorAll("ul[class^='recipe-']");
  for (let i = 0; i < recipeLists.length; i++) {
    recipeLists[i].innerHTML = "";
  }

  // Loop through recipes and build HTML strings
  for (let i = 0; i < recipes.length; i++) {
    let recipe = recipes[i];
    let list = document.querySelector(`.recipe-${recipe.category}`);
    if (list) {
      list.innerHTML += `<li><a href="${recipe.source}" target="_blank">${recipe.name} by ${recipe.chef}</a></li>`;
    }
  }
}

// Fetch recipes from database
onValue(referenceInDb, function (snapshot) {
  const snapshotValues = snapshot.val();
  if (snapshotValues) {
    recipes = Object.values(snapshotValues);
  } else {
    recipes = []; // If no recipes exist
  }
  renderRecipes();
});

renderCat(categories);

addBtn.addEventListener("click", function () {
  let newRecipe = {
    name: name.value,
    source: source.value,
    category: category.value,
    chef: chef.value,
  };
  push(referenceInDb, newRecipe);

  // Clear form
  name.value = "";
  source.value = "";
  category.value = "";
  chef.value = "";
});

newRecipeBtn.addEventListener("click", function () {
  recipeForm.classList.toggle("active");
});
