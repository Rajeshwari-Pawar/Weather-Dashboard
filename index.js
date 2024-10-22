const inputField = document.querySelector(".inputField");
const searchWeatherBtn = document.querySelector(".searchBtn");
const weatherDisplayTop = document.querySelector(".topBox");
const forecastDisplayBottom = document.querySelector(".bottomBox");
const locationWeatherBtn = document.querySelector(".locationBtn");


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

        inputField.value = "";
        weatherDisplayTop.innerHTML = "";
        forecastDisplayBottom.innerHTML = "";

        filteredData.forEach((forecastItem, idx) => {
            if (idx === 0) {
                weatherDisplayTop.insertAdjacentHTML("beforeend", generateWeatherCard(cityName, forecastItem, idx));
            } else {
                forecastDisplayBottom.insertAdjacentHTML("beforeend", generateWeatherCard(cityName, forecastItem, idx));
            }
        });
    } catch (error) {
        alert("Error fetching weather data!");
    }
};


const generateWeatherCard = (city, weatherData, dayIndex) => {
    if(dayIndex === 0) {
        return `<div class="weather-details">
                    <h2>${city} (${weatherData.dt_txt.split(" ")[0]})</h2>
                    <h4>Temperature: ${weatherData.main.temp}°C</h4>
                    <h4>Wind: ${weatherData.wind.speed} M/S</h4>
                    <h4>Humidity: ${weatherData.main.humidity}%</h4>
                </div>
                <div class="weather-icon">
                    <img src="https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png" alt="weather-img">
                    <!--<img src="https://static.vecteezy.com/system/resources/previews/024/825/182/original/3d-weather-icon-day-with-rain-free-png.png" alt="">-->
                    <h4>${weatherData.weather[0].description}</h4>
                </div>`;
    }else {
        return `<div class="card">
                    <h2>(${weatherData.dt_txt.split(" ")[0]})</h2>
                    <img src="https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png" alt="weather-img">
                    <h4>Temp: ${weatherData.main.temp}°C</h4>
                    <h4>Wind: ${weatherData.wind.speed} M/S</h4>
                    <h4>Humidity: ${weatherData.main.humidity}%</h4>
                </div>`;
    }
}


locationWeatherBtn.addEventListener("click", findUserLocationWeather);



async function findUserLocationWeather () {
    try {
        const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        const { latitude, longitude } = position.coords;

        const reverseGeoAPI = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${apiKey}`;
        
        const response = await fetch(reverseGeoAPI);
        const userData = await response.json();

        const { name } = userData[0];

        getForecast(name, latitude, longitude);

    } catch (error) {
        if (error.code === error.PERMISSION_DENIED) {
            alert("Location permission denied. Please enable location access.");
        } else {
            alert("Error fetching location or weather data!");
        }
    }
};

