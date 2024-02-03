import { setLocationObject } from "./dataFunctions.js"; 
import { addSpinner, displayError } from "./domFunctions.js";
import CurrentLocation from "./CurrentLocation.js";
const currentLoc = new CurrentLocation();

const initApp = () => {
    // add listeners
    const geoButton = document.getElementById("getLocation");
    geoButton.addEventListener("click", getGeoWeather);
    const homeButton = document.getElementById("home");
    homeButton.addEventListener("click", loadWeather);

    // set up

    // load weather

    loadWeather();

};

document.addEventListener("DOMContentLoaded", initApp);

const getGeoWeather = (event) => {
    if (event) {
        if (event.type === "click") {
            // add spinner
            const mapIcon = document.querySelector(".fa-map-marker-alt");
            addSpinner(mapIcon);
        }

        if (!navigator.geolocation) {
            return geoError();
        }

        // build in browser location
        navigator.geolocation.getCurrentPosition(geoSuccess, geoError)
    }
};

const geoError = (errObj) => {
    const errMsg = errObj ? errObj.message : "Geolocation not supported";
    displayError(errMsg, errMsg);
};

// passing browser location
const geoSuccess = (position) => {
    const myCoordsObj = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
        name: `Lat: ${position.coords.latitude} Long: ${position.coords.longitude}`
    };

    // passing instance of Current Location class, current location from browser
    setLocationObject(currentLoc, myCoordsObj);
    //updateDataAndDisplay(currentLoc);
}

const loadWeather = (event) => {
    //const savedLocation = getHomeLocation();
}

const updateDataAndDisplay = async (locationObj) => {
    const weatherJson = await getWeatherFromCoords(locationObj);
    if (weatherJson) updateDataAndDisplay(weatherJson, locationObj);
}

