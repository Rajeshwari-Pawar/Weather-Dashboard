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
