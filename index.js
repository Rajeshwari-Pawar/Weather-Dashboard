const inputField = document.querySelector(".inputField");
const searchWeatherBtn = document.querySelector(".searchBtn");

const apiKey = "13d472083a14db983ea3e246a52880e3";

searchWeatherBtn.addEventListener("click", findCityCoordinates);








async function findCityCoordinates() {
    const inputCity = inputField.value.trim();
    if (!inputCity) return;

    const geoAPI = `http://api.openweathermap.org/geo/1.0/direct?q=${inputCity}&limit=1&appid=${apiKey}`;

    try {
        const response = await fetch(geoAPI);
        const locationData = await response.json();

        if (!locationData.length) {
            alert(`No coordinates found for ${inputCity}`);
        } else {
            const { name, lat, lon } = locationData[0];
            getForecast(name, lat, lon);
        }
    } catch (error) {
        console.error(error);
        alert("Failed to fetch coordinates. Please try again.");
    }
};





async function getForecast (cityName, latitude, longitude) {
    
    const weatherAPI = `http://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;

    try {
        const response = await fetch(weatherAPI);

        const forecastData = await response.json();
        

        const days = [];

        const filteredData = forecastData.list.filter(forecast => {
            const date = new Date(forecast.dt_txt).getDate();
            if (!days.includes(date)) {
                return days.push(date);
            }
        });

        console.log(filteredData);

        /*inputField.value = "";
        weatherDisplayTop.innerHTML = "";
        forecastDisplayBottom.innerHTML = "";*/

        filteredData.forEach((forecastItem, idx) => {
            /*if (idx === 0) {
                weatherDisplayTop.insertAdjacentHTML("beforeend", generateWeatherCard(cityName, forecastItem, idx));
            } else {
                forecastDisplayBottom.insertAdjacentHTML("beforeend", generateWeatherCard(cityName, forecastItem, idx));
            }*/
        });
    } catch (error) {
        alert("Error fetching weather data!");
    }
};