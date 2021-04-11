const mealsEl = document.getElementById("meals");
const fav_meals = document.getElementById("fav-meals");
const searchTerm = document.getElementById("search-term");
const searchBtn = document.getElementById("search");
const mealPopup = document.getElementById("meal-popup");
const mealCloseBtn = document.getElementById("close-popup");
const mealInfoEl = document.getElementById("meal-info")
getRandomMeal();
updatefavourateMeal();
async function getRandomMeal() {
    const resp = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
    const respData = await resp.json();
    const randomMeal = respData.meals[0];
    addMeal(randomMeal);
}
async function getMealById(id) {
    const resp = await fetch("https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id);
    const respData = await resp.json();
    const meal = respData.meals[0];
    const random = Math.random();
    fav_meals.innerHTML += `<li id="${random}">
    <button class="clear" onclick=deleteElement(${id})><i class="fas fa-window-close"></i></button>
    <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
    <span>${meal.strMeal}</span>
    </li>`;
    document.getElementById(random).addEventListener("click", () => {
        showMealInfo(meal);
    })
}
function deleteElement(id) {
    removeMealFormLocalStorage(id);
    updatefavourateMeal();
}
async function getMealBySearch(term) {
    const resp = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=" + term)//.json();
    const respData = await resp.json();
    const meals = respData.meals;
    return meals;
}
function addMeal(mealData) {
    const meal = document.createElement('div');
    meal.classList.add('meal');
    meal.innerHTML = `<div class="meal">
    <div class="meal-header">
    <span class="random">${mealData.strMeal}</span>
        <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}">
    </div>
    <div class="meal-body">
        <h4>${mealData.strMeal}</h4>
        <button class="fav-btn"><i class="fas fa-heart"></i></button>
    </div>
</div>`;
    mealsEl.appendChild(meal);
    const btn = document.querySelector(".meal-body .fav-btn");
    btn.addEventListener("click", () => {
        if (btn.classList.contains("active")) {
            removeMealFormLocalStorage(mealData.idMeal);
            btn.classList.remove("active");
        } else {
            addMealsToLocalStorage(mealData.idMeal);
            btn.classList.add("active");
        }
        updatefavourateMeal();
    })
    document.getElementsByClassName("meal-header")[0].addEventListener("click", () => {
        showMealInfo(mealData);
    })
}

function updatefavourateMeal() {
    //clean the container
    fav_meals.innerHTML = "";
    const mealIds = getMealsFromLocalStorage();
    if (mealIds == null)
        return;
    mealIds.forEach(meal => getMealById(meal));
}
function addMealsToLocalStorage(mealId) {
    const mealIds = getMealsFromLocalStorage();
    localStorage.setItem("mealIds", JSON.stringify([...mealIds, mealId]));
}
function removeMealFormLocalStorage(mealId) {
    const mealIds = getMealsFromLocalStorage();
    localStorage.setItem("mealIds", JSON.stringify(mealIds.filter(id => id != mealId)));
}
function getMealsFromLocalStorage() {
    const mealIds = JSON.parse(localStorage.getItem("mealIds"));
    return mealIds === null ? [] : mealIds;
}
searchBtn.addEventListener("click", async () => {
    const search = searchTerm.value;
    searchTerm.value = "";
    const meals = await getMealBySearch(search);
    if (meals == null)
        return;
    mealsEl.innerHTML = "";
    meals.forEach(meal => { addMeal(meal) });
})
mealCloseBtn.addEventListener("click", () => {
    mealPopup.classList.add("hidden");
})
function showMealInfo(mealData) {
    console.log(mealData);
    let ingeredients = [];
    for (let i = 1; i <= 20; i++) {
        if (mealData["strIngredient" + i]) {
ingeredients.push(`${ mealData["strIngredient" + i]}: ${mealData["strMeasure" + i ]}`)
        }else 
        break;
    }
    mealInfoEl.innerHTML = "";
    const mealEl = document.createElement("div");
    mealEl.innerHTML = `<h1>${mealData.strMeal}</h1>
    <img src="${mealData.strMealThumb}" alt="">
    <p>
     ${mealData.strInstructions}
    </p>
    <h3>Ingredients</h3>
    <ul>
    ${ingeredients.map((ing)=>`<li>${ing}</li>`)
    .join(' ')}
    </ul>
    <h3><a href="${mealData.strYoutube}">=>full-recipe-video</a></h3>
    `;
   
    mealInfoEl.appendChild(mealEl);
    mealPopup.classList.remove("hidden");
    ingeredients.map((ing)=>{console.log(ing)}).join();
}