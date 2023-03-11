const yourWeather = document.querySelector("[data_yourWeather]");
const searchWeather = document.querySelector("[data_searchWeather]");

const grantLocationContainer = document.querySelector(".grant-access-container");
const yourWeatherContainer = document.querySelector(".your-weather-container");
const searchForm = document.querySelector(".search-form");

// initial 
let currentTab = yourWeather;
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
getfromSessionStorage();
currentTab.classList.add("current-tab");
function switchTab(clickedTab){
    if(clickedTab != currentTab){
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");

        // check if the search form container is visible or not
        if(!searchForm.classList.contains("active")){
            grantLocationContainer.classList.remove("active");
            yourWeatherContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            // it means you clicked on your weather tab
            searchForm.classList.remove("active");
            // now check is user gave access of location or not
            getfromSessionStorage();
        }
    }
};
yourWeather.addEventListener("click", () => {
    switchTab(yourWeather);
});
searchWeather.addEventListener("click", () => {
    switchTab(searchWeather);
});

function getfromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        grantLocationContainer.classList.add("active");
    }
    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates){
    const {lat, lon} = coordinates;
    grantLocationContainer.classList.remove("active");
    // fetch the loading sccreen container 
    const loadingScreen = document.querySelector(".loading");
    // activate the loading screen
    loadingScreen.classList.add("active");

    // API call
    try{
        console.log("API fetching");
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        loadingScreen.classList.remove("active");
        yourWeatherContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err){
        loadingScreen.classList.remove("active");
        console.log("error agyi hai");
        grantLocationContainer.classList.add("active");
    }
};

function renderWeatherInfo(weatherInfo){
    console.log("fetching the element of your weather container");
    // fetch the required element from the HTML
    const cityName = document.querySelector("[data_cityName]");
    const countryFlag= document.querySelector("[data_countryFlag]");
    const weatherDesc= document.querySelector("[data_weatherDesc]");
    const weatherIcon= document.querySelector("[data_weatherIcon]");
    const weatherTemp= document.querySelector("[data_temp]");
    const windSpeed= document.querySelector("[data_windSpeed]");
    const humidity= document.querySelector("[data_humidity]");
    const clouds= document.querySelector("[data_clouds]");
    
    console.log(weatherInfo);
    // update the data getting from the weatherInfo on the UI
    cityName.innerText = weatherInfo?.name;
    countryFlag.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    weatherDesc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    weatherTemp.innerText = `${weatherInfo?.main?.temp} °C`;
    windSpeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity} %`;
    clouds.innerText = `${weatherInfo?.clouds?.all} %`;    

}

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        // shpwing an alert that no laocation found
        alert("No such location found");
    }
}

function showPosition(position){
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }
    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    console.log("calling fetch user weather function");
    fetchUserWeatherInfo(userCoordinates);
    console.log("done fetch user weather function");
}

// fetching grant access button
const locationAccessBtn = document.querySelector(".grant-btn");
locationAccessBtn.addEventListener("click", getLocation);

const searchInput = document.querySelector("[data_searchInput]");
searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let city = searchInput.value;
    if(city === ""){
        return;
    }
    else{
        fetchSearchWeatherInfo(city);
    }
});

async function fetchSearchWeatherInfo(city){
    // loadingScreen.classList.add("active");
    yourWeatherContainer.classList.remove("active");
    grantLocationContainer.classList.remove("active");

    // API CALL
    try{
        console.log("fetching API by city name");
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        console.log("converting api into json");
        const data = await response.json();
        console.log("activating loading screen");
        // loadingScreen.classList.add("active");
        console.log("indating on UI data");
        yourWeatherContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err){
        // loadingScreen.classList.remove("active");
        alert("error aagyi hai");
    }
}