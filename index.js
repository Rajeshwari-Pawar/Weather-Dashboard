const city = document.querySelector(".inputField");
const searchBtn = document.querySelector(".searchBtn");

searchBtn.addEventListener("click", searchCity);

function searchCity() {
    const cityName = city.value;
    if(city.value = "") return;
    city.value = "";

    console.log(cityName);
}