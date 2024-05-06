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
// Main content
const forecastForTodayDiv = document.querySelector("#forecast-for-today-box");
// Forecast list
const forecastListDiv = document.querySelector("#forecast-list-box");

// [TEST]
async function handleSubmit(event) {
  // Prevents submit event from reloading the website
  event.preventDefault();

  // Gets the city name from the form's city field
  const cityName = cityField.value;

  // Gets the cities with that city name
  const geocodingData = await directGeocoding(cityName);

  // [TEST]
  console.log(geocodingData);

  // The city the user selected
  const selectedCity = geocodingData.at(0);

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

  // Gets the weather forecast for today for the selected city
  const weatherDataToday = await getWeatherForecastToday(
    selectedCity.lat,
    selectedCity.lon
  );

  // Gets the 5 day weather forecast for the selected city
  const weatherDataFiveDay = await getWeatherForecastFiveDay(
    selectedCity.lat,
    selectedCity.lon
  );

  // Renders the main content of the city with weather data of the selected city
  renderMainContent(weatherDataToday, weatherDataFiveDay);
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

function renderTodayForecast(todayData) {
  // Creates a new today's forecast element
  const newTodayForecast = document.createElement("div");
  newTodayForecast.setAttribute("id", "forecast-for-today");
  newTodayForecast.setAttribute("class", "column");

  // Creates a new today's forecast header and adds it to it
  const newHeader = document.createElement("h1");
  newHeader.setAttribute("id", "city-label");
  newHeader.textContent = `${todayData.name} ${todayData.weather.at(0).icon}`;
  newTodayForecast.appendChild(newHeader);

  // Creates a new today's forecast label and adds it to it
  const newLabel = document.createElement("h3");
  newLabel.setAttribute("class", "label");
  newLabel.textContent = "Today's forecast:";
  newTodayForecast.appendChild(newLabel);

  // Creates a new today's forecast data element
  const newTodayForecastData = document.createElement("div");
  newTodayForecastData.setAttribute("id", "today-forecast-data");
  newTodayForecastData.setAttribute("class", "column");

  // Creates the new today's forecast data's temperature div
  renderForecastWeatherDataDiv(
    newTodayForecastData,
    "Temp:",
    `${todayData.main.temp} °C`
  );

  // Creates the new today's forecast data's wind div
  renderForecastWeatherDataDiv(
    newTodayForecastData,
    "Wind:",
    `${todayData.wind.speed} KPH`
  );

  // Creates the new today's forecast data's humidity div
  renderForecastWeatherDataDiv(
    newTodayForecastData,
    "Humidity:",
    `${todayData.main.humidity}%`
  );

  // Adds the new today's forecast data element
  newTodayForecast.appendChild(newTodayForecastData);

  // Adds the new today's forecast element to its box
  forecastForTodayDiv.appendChild(newTodayForecast);
}

function clearTodayForecast() {
  // Removes the old today's forecast from the DOM
  const oldTodayForecast = document.getElementById("forecast-for-today");
  oldTodayForecast.remove();
}

function renderFiveDayForecast(fiveDayData) {
  // Creates an empty forecast list
  const newForecastList = document.createElement("ul");
  newForecastList.setAttribute("id", "forecast-list");

  // Creates a new list item for each element of the selected city weather data array
  for (const item of fiveDayData) {
    // Creates the new list item
    const newListItem = document.createElement("li");
    newListItem.setAttribute("class", "column forecast-list-item");

    // Creates the list item's h4 header and adds it to the list item
    const newHeader = document.createElement("h4");
    newHeader.textContent = item.dt_txt;
    newListItem.appendChild(newHeader);

    // Creates the list item's weather icon and adds it to the list item
    const newWeatherIcon = document.createElement("p");
    newWeatherIcon.setAttribute("class", "weather-icon");
    newWeatherIcon.textContent = item.weather.at(0).icon;
    newListItem.appendChild(newWeatherIcon);

    // Creates the list item's temperature div and adds it to the list item
    renderForecastWeatherDataDiv(newListItem, "Temp:", `${item.main.temp} °C`);

    // Creates the list item's wind div and adds it to the list item
    renderForecastWeatherDataDiv(
      newListItem,
      "Wind:",
      `${item.wind.speed} KPH`
    );

    // Creates the list item's humidity div and adds it to the list item
    renderForecastWeatherDataDiv(
      newListItem,
      "Humidity:",
      `${item.main.humidity}%`
    );

    // Adds the new list item to the forecast list
    newForecastList.appendChild(newListItem);
  }

  // Adds a label to the forecast list box
  const newLabel = document.createElement("h3");
  newLabel.setAttribute("id", "forecast-list-label");
  newLabel.setAttribute("class", "label");
  newLabel.textContent = "For the next 5 days:";
  forecastListDiv.appendChild(newLabel);

  // Adds the new forecast list to the forecast list box
  forecastListDiv.appendChild(newForecastList);
}

function renderForecastWeatherDataDiv(parentElement, label, value) {
  // Creates a new data div
  const newDataDiv = document.createElement("div");
  newDataDiv.setAttribute("class", "row");

  // Label
  const newLabel = document.createElement("p");
  newLabel.setAttribute("class", "emphasis");
  newLabel.textContent = label;
  newDataDiv.appendChild(newLabel);

  // Value
  const newValue = document.createElement("p");
  newValue.textContent = value;
  newDataDiv.appendChild(newValue);

  // Adds the new data div to the list item
  parentElement.appendChild(newDataDiv);
}

function clearFiveDayForecast() {
  // Removes the old five day forecast from the DOM
  const oldLabel = document.getElementById("forecast-list-label");
  oldLabel.remove();
  const oldFiveDayForecast = document.getElementById("forecast-list");
  oldFiveDayForecast.remove();
}

function renderMainContent(weatherDataToday, weatherDataFiveDay) {
  // Generates the timestamps of the next five days from now
  const nextFiveDaysDates = [
    `${dayjs().add(1, "day").format("YYYY-MM-DD")} 12:00:00`,
    `${dayjs().add(2, "day").format("YYYY-MM-DD")} 12:00:00`,
    `${dayjs().add(3, "day").format("YYYY-MM-DD")} 12:00:00`,
    `${dayjs().add(4, "day").format("YYYY-MM-DD")} 12:00:00`,
    `${dayjs().add(5, "day").format("YYYY-MM-DD")} 12:00:00`,
  ];

  // Gets only the timestamps that are included in the list
  const fiveDayData = weatherDataFiveDay.list.filter((item) =>
    nextFiveDaysDates.includes(item.dt_txt)
  );

  // Renders the forecast for today
  renderTodayForecast(weatherDataToday);

  // Renders the forecast for the next five days
  renderFiveDayForecast(fiveDayData);
}

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

// [TEST]
async function getWeatherForecastToday(lat, lon) {
  // Gets the weather forecast for today
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
  );

  // Converts the data to JSON
  const data = await response.json();

  //[TEST]
  console.log(data);

  // Returns data
  return data;
}

// [TEST]
async function getWeatherForecastFiveDay(lat, lon) {
  // Gets a five day forecast for the given latitude and longuitude in metric units
  const response = await fetch(
    `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
  );

  // Converts the data to JSON
  const data = await response.json();

  // [TEST]
  console.log(data);

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
