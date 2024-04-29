// OpenWeather API key
const API_KEY = "1e7f7d411e7d9fb65f6700dcf9e7d269";
// Search history
let searchHistory = [];

// Form city field
const cityField = document.querySelector("#city-field");
// Form submit button
const submitButton = document.querySelector("#submit-button");
// Search history
const searchHistoryListDiv = document.querySelector("#search-history-list-box");

// Handles form submits
async function handleSubmit(event) {
  // Prevents submit event from reloading the website
  event.preventDefault();

  // Gets the city name from the form's city field
  const cityName = cityField.value;

  // Gets the cities with that city name
  const data = await directGeocoding(cityName);

  // [TEST]
  console.log(data);

  // The city the user selected
  const selectedCity = data.at(0);

  // A new city item is created
  const newCity = {
    id: crypto.randomUUID(),
    name: selectedCity.name,
    country: selectedCity.country,
    state: selectedCity.state ?? null,
    lat: selectedCity.lat,
    lon: selectedCity.lon,
  };

  // The new city is added to the search history
  searchHistory.unshift(newCity);

  // The search history is saved in local storage
  localStorage.setItem("searchHistory", JSON.stringify(searchHistory));

  // Resets the form's city field
  cityField.value = "";
  // Clears old search history
  clearSearchHistory();
  // Rerenders search history
  renderSearchHistory();
}

function handleSearchHistoryClick(id) {
  // Gets the clicked item from the search history list
  const item = searchHistory.filter((item) => item.id === id).at(0);
  console.log(item);
}

function renderSearchHistory() {
  // Creates an empty search history list
  const newSearchHistoryList = document.createElement("ul");
  newSearchHistoryList.setAttribute("id", "search-history-list");
  newSearchHistoryList.setAttribute("class", "column");

  // Creates a new list item for each element of the search history array
  for (const item of searchHistory) {
    // Creates the new list item
    const newListItem = document.createElement("li");
    newListItem.setAttribute("id", item.id);
    newListItem.setAttribute("class", "search-history-item");
    // Creates the list item's button
    const newButton = document.createElement("button");
    newButton.textContent = item.name;
    newButton.addEventListener("click", () =>
      handleSearchHistoryClick(item.id)
    );
    // Adds the button to the list item
    newListItem.appendChild(newButton);

    // Adds the new list item to the search history list
    newSearchHistoryList.appendChild(newListItem);
  }

  // Adds the new search history list to the search history list box
  searchHistoryListDiv.appendChild(newSearchHistoryList);
}

function clearSearchHistory() {
  // Removes the old search history list from the DOM
  const oldSearchHistoryList = document.getElementById("search-history-list");
  oldSearchHistoryList.remove();
}

function renderMainContent() {}

async function directGeocoding(cityName) {
  // Gets all the cities that have the given city name
  const response = await fetch(
    `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${API_KEY}`
  );
  // Converts the data to JSON
  const data = await response.json();

  // Returns data
  return data;
}

function loadLocalStorage() {
  // The search history is retrieved from local storage
  searchHistory = JSON.parse(localStorage.getItem("searchHistory"));

  // If the search history is null, it is set to an empty list
  if (!searchHistory) {
    searchHistory = [];
  }
}

// Main function
function main() {
  // Loads local storage items
  loadLocalStorage();

  // Renders the search history list
  renderSearchHistory();

  // Adds click event listener to the form's submit button
  submitButton.addEventListener("click", handleSubmit);
}

// Runs first render commands
main();
