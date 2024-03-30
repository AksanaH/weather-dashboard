const searchedEl = document.getElementById('searched-cities');
const weatherToday = document.getElementById('weather-today');

function init() {
    const searchedLocations = JSON.parse(localStorage.getItem('locations'));
    console.log(searchedLocations);
    if (searchedLocations === null) {
        return;
    }

    for (const location of searchedLocations) {

        const newRow = document.createElement("div");

        const nameOfSearchedLocation = document.createElement("h3");

        nameOfSearchedLocation.textContent = location.name;
        newRow.append(nameOfSearchedLocation);
        searchedEl.append(newRow);
    }
}
//checking in local storage, in {} - object
localStorage.setItem("locations", JSON.stringify([{ name: "John" }]));

init();


async function searchByCityName(cityName) {
    const coordinatesAPIUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=fccdefd57bcea699f68e81473b5ec93c`
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
        const weatherAPI = `http://api.openweathermap.org/data/2.5/forecast?units=imperial&lat=${coordinates.lat}&lon=${coordinates.lon}&appid=fccdefd57bcea699f68e81473b5ec93c`
        const weather = await fetch(weatherAPI)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            return data;
        });
        const today = dayjs().format('MM/D/YYYY');

        const newRow = document.createElement("div");

        const nameOfSearchedLocation = document.createElement("h3");
        nameOfSearchedLocation.textContent = `${weather.city.name} (${today})`;

        const mainTemp = document.createElement("p");
        mainTemp.textContent =  `Temp: ${weather.list[0].main.temp}°F`;

        const wind = document.createElement("p");
        wind.textContent =  `Wind: ${weather.list[0].wind.speed} MPH`;

        const humidity = document.createElement("p");
        humidity.textContent =  `Humidity: ${weather.list[0].main.humidity} %`;

        const icon = document.createElement("img");
        icon.setAttribute("src", `https://openweathermap.org/img/wn/${weather.list[0].weather[0].icon}.png`) 

        newRow.append(nameOfSearchedLocation);
        nameOfSearchedLocation.append(icon)
        newRow.append( mainTemp)
        newRow.append( wind)
        newRow.append( humidity)
   
        weatherToday.append(newRow);

        console.log(weather)

}
searchByCityName("LA")