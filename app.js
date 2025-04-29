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

let categories = ["soups", "sauce", "smoothies", "pasta", "pastries", "others"];

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function renderCat(cat) {
  let categoryListItems = "";
  for (let i = 0; i < cat.length; i++) {
    let category = cat[i];
    categoryListItems += `<div class="recipe"><h3>${capitalizeFirstLetter(
      category
    )}</h3>
    <ul class="recipe-${category}">
    </ul></div>`;
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

// Wait for FULL page load (including images, fonts, videos)
const fadeTime = 500; // Fade-out duration (0.5s)
const delayBeforeFade = 2000; // Delay before starting fade-out (2s)

window.addEventListener("load", function () {
  const preloader = document.getElementById("preloader");
  const content = document.getElementById("maincontainer");

  // Wait before starting fade-out
  setTimeout(() => {
    preloader.style.transition = `opacity ${fadeTime}ms ease`;
    preloader.style.opacity = "0";

    // After fade-out completes
    setTimeout(() => {
      preloader.style.display = "none"; // Fully hide preloader
      content.style.display = "block"; // Show page content
      document.body.style.overflow = "auto"; // Enable scrolling

      // Trigger fade-in of content
      setTimeout(() => {
        content.classList.add("visible"); // Fade in content
      }, 50); // Tiny delay to ensure "display:block" is applied before animating
    }, fadeTime);
  }, delayBeforeFade);
});
document.getElementById("refreshButton").addEventListener("click", () => {
  window.location.reload();
});

var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("new-recipe");
var mainCon = document.getElementById("maincontainer");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function () {
  modal.style.display = "flex";
  document.body.style.overflow = "hidden";
  window.scrollTo({
    top: 0,
    behavior: "smooth", // Optional: adds a smooth scrolling animation
  });
};

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modal.style.display = "none";
  document.body.style.overflow = "auto";
};

// When the user clicks anywhere outside of the modal, close it
// window.onclick = function (event) {
//   if (event.target == modal) {
//     modal.style.display = "none";
//     document.body.style.overflow = "auto";
//   }
// };
