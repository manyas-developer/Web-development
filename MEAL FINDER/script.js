//get elements from html
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const results = document.getElementById('results');
const message = document.getElementById('message');
const modal = document.getElementById('modal');
const modalBody = document.getElementById('modalBody');
const closeBtn = document.getElementById('closeBtn');   // FIXED

// Search button click
searchBtn.addEventListener('click', searchMeal);

// Close modal click
closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

//making call to server i.e search for meals
async function searchMeal() {
    //get the search term from input
    const searchTerm = searchInput.value;

    //check if search term is empty
    if (searchTerm === '') {
        message.textContent = 'Please enter a meal name';
        return;
    }

    //clear previous result
    results.innerHTML = '';
    message.textContent = 'Searching...';

    //make api call
    const apiUrl = `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`;

    //use await to wait for response
    const response = await fetch(apiUrl);
    const data = await response.json();

    //check if meals were found
    if (data.meals === null) {
        message.textContent = 'No meals found. Try another search.';
        return;
    }

    message.textContent = '';

    //loop through the meals and display them
    data.meals.forEach(meal => {
        //create meal card
        const mealCard = document.createElement('div');
        mealCard.className = 'meal-card';

        mealCard.innerHTML = `
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <div class="meal-info">
                <h3>${meal.strMeal}</h3>
                <p>${meal.strCategory} - ${meal.strArea}</p>
            </div>
        `;

        //open modal when clicked
        mealCard.addEventListener('click', () => showMeal(meal));

        //append card
        results.appendChild(mealCard);
    });
}

// Function to display meal details
function showMeal(meal) {
    modal.style.display = 'block';

    //ingredients
    let ingredients = "";
    for (let i = 1; i <= 20; i++) {
        const ing = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];

        if (ing && ing.trim() !== "") {
            ingredients += `<li>${ing} - ${measure}</li>`;
        }
    }

    modalBody.innerHTML = `
        <div class="modal-header">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <h2>${meal.strMeal}</h2>
            <p><strong>Category:</strong> ${meal.strCategory} | 
               <strong>Area:</strong> ${meal.strArea}</p>
        </div>

        <div class="modal-body">
            <h3>Ingredients:</h3>
            <ul>${ingredients}</ul>

            <h3>Instructions:</h3>
            <p>${meal.strInstructions}</p>
        </div>
    `;
}
