const searchedEl = document.getElementById('searched-cities');
const weatherToday = document.getElementById('weather-today');
const fiveDaysWeather = document.getElementById('five-days-weather');
const searchButton = document.querySelector('.btn-search');
const cityInput = document.getElementById('city');
const apiKey = "cdeb16e9afd1fe2ebd0a226a64efa381";

function init() {
    const searchedLocations = JSON.parse(localStorage.getItem('locations'));

    if (searchedLocations === null) {
        return;
    }
    searchedEl.innerHTML = null;
    for (const location of searchedLocations) {

        const button = document.createElement("button");


        button.textContent = location;

        searchedEl.append(button);
        button.addEventListener("click", handlePreviousSearch);
    }
}
function handlePreviousSearch(event) {
    search(event.target.innerText, false)
}


function handlseSearch(event) {
    const cityName = cityInput.value;
    if(cityName === null || cityName === ""){
        alert("Pls fill out search field")
    }
    else {
        search(cityName, true)
    }
}
function search(cityName, needUpdateLocations) {
    weatherToday.innerHTML = null;
    fiveDaysWeather.innerHTML = null;
    searchByCityName(cityName);
    cityInput.value = "";

    if (needUpdateLocations) {
        const searchedLocations = JSON.parse(localStorage.getItem('locations'));

        if (searchedLocations === null) {
            
            localStorage.setItem("locations", JSON.stringify([cityName]));
        } else {
            searchedLocations.push(cityName);
            localStorage.setItem("locations", JSON.stringify(searchedLocations));
        }
        init();
    }

}
async function searchByCityName(cityName) {
    const coordinatesAPIUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`
    const coordinates = await fetch(coordinatesAPIUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            return {
                lat: data[0].lat,
                lon: data[0].lon,
            }
        });
    const weatherAPI = `http://api.openweathermap.org/data/2.5/forecast?units=imperial&lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}`
    const weather = await fetch(weatherAPI)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            return data;
        });
    const today = dayjs().format('MM/D/YYYY');
    displayTodayBlock(weather, today);
    display5DaysBlocks(weather, today);

    console.log(weather)

}
function displayTodayBlock(weather, today) {

    const newRow = document.createElement("div");

    const nameOfSearchedLocation = document.createElement("h3");
    nameOfSearchedLocation.textContent = `${weather.city.name} (${today})`;

    const mainTemp = document.createElement("p");
    mainTemp.textContent = `Temp: ${weather.list[0].main.temp}°F`;

    const wind = document.createElement("p");
    wind.textContent = `Wind: ${weather.list[0].wind.speed} MPH`;

    const humidity = document.createElement("p");
    humidity.textContent = `Humidity: ${weather.list[0].main.humidity} %`;

    const icon = document.createElement("img");
    icon.setAttribute("src", `https://openweathermap.org/img/wn/${weather.list[0].weather[0].icon}.png`)

    newRow.append(nameOfSearchedLocation);
    nameOfSearchedLocation.append(icon)
    newRow.append(mainTemp)
    newRow.append(wind)
    newRow.append(humidity)

    weatherToday.append(newRow);
}

function display5DaysBlocks(weather, today) {

    for (const element of weather.list) {
        const currentDate = dayjs(element.dt_txt);
        const days = currentDate.diff(today, 'days');
        if (days > 0 && currentDate.hour() === 15) {
            const newRow = document.createElement("div");
            newRow.classList.add("next-days")
            const nameOfSearchedLocation = document.createElement("h3");
            nameOfSearchedLocation.textContent = `(${currentDate.format('MM/D/YYYY')})`;

            const mainTemp = document.createElement("p");
            mainTemp.textContent = `Temp: ${element.main.temp}°F`;

            const wind = document.createElement("p");
            wind.textContent = `Wind: ${element.wind.speed} MPH`;

            const humidity = document.createElement("p");
            humidity.textContent = `Humidity: ${element.main.humidity} %`;

            const icon = document.createElement("img");
            icon.setAttribute("src", `https://openweathermap.org/img/wn/${element.weather[0].icon}.png`)
           
            newRow.append(nameOfSearchedLocation);
            newRow.append(icon)
            newRow.append(mainTemp)
            newRow.append(wind)
            newRow.append(humidity)

            fiveDaysWeather.append(newRow);
        }

    }

}
searchButton.addEventListener("click", handlseSearch);
cityInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        handlseSearch(event)
    }
});
init();