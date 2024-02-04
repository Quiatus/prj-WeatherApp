import { 
    setLocationObject, 
    getHomeLocation,
    cleanText, 
    getCoordsFromApi,
    getWeatherFromCoords
} from "./dataFunctions.js"; 

import { 
    setPlaceholderText,
    addSpinner,
    displayError, 
    displayApiError,
    updateScreenReaderConfirmation, 
    updateDisplay
} from "./domFunctions.js";

import CurrentLocation from "./CurrentLocation.js";
const currentLoc = new CurrentLocation();

const initApp = () => {
    // add listeners
    const geoButton = document.getElementById("getLocation");
    geoButton.addEventListener("click", getGeoWeather);
    const homeButton = document.getElementById("home");
    homeButton.addEventListener("click", loadWeather);
    const saveButton = document.getElementById('saveLocation');
    saveButton.addEventListener('click', saveLocation);
    const unitButton = document.getElementById("unit");
    unitButton.addEventListener("click", setUnitPref);
    const refreshButton = document.getElementById("refresh");
    refreshButton.addEventListener("click", refreshWeather);
    const locationEntry = document.getElementById("searchBar__form");
    locationEntry.addEventListener("submit", submitNewLocation);

    // set up
    setPlaceholderText();

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

        if (!navigator.geolocation) return geoError();

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
};

// loads weather based on user action
const loadWeather = (event) => {
    const savedLocation = getHomeLocation();
    if (!savedLocation && !event) return getGeoWeather(); 
    if (!savedLocation && event.type === "click") {
        displayError("No Home Location Saved", "Please save your home location first.")
    } else if (savedLocation && !event) {
        displayHomeLocationWeather(savedLocation);
    } else {
        const homeIcon = document.querySelector(".fa-home");
        addSpinner(homeIcon);
        displayHomeLocationWeather(savedLocation);
    }
};

// loads weather based on saved home location
const displayHomeLocationWeather = (home) => {
    if (typeof home === "string") {
        const locationJson = JSON.parse(home);
        const myCoordsObj = {
            lat: locationJson.lat,
            lon: locationJson.lon,
            name: locationJson.name,
            unit: locationJson.unit
        };

        setLocationObject(currentLoc, myCoordsObj);
        updateDataAndDisplay(currentLoc);
    }
};

// saves current location as home location to local storage
const saveLocation = () => {
    if (currentLoc.getLat() && currentLoc.getLon()) {
        const saveIcon = document.querySelector(".fa-save");
        addSpinner(saveIcon);
        const location = {
            name: currentLoc.getName(),
            lat: currentLoc.getLat(),
            lon: currentLoc.getLon(),
            unit: currentLoc.getUnit()
        };

        localStorage.setItem("defaultWeatherLocation", JSON.stringify(location));
        updateScreenReaderConfirmation(`Saved ${currentLoc.getName()} as home location`);
    }
};

// switch between metric and imperial
const setUnitPref = () => {
    const unitIcon = document.querySelector(".fa-chart-bar");
    addSpinner(unitIcon);
    currentLoc.toggleUnit();
    updateDataAndDisplay(currentLoc);
};

const refreshWeather = () => {
    const refreshIcon = document.querySelector(".fa-sync-alt");
    addSpinner(refreshIcon);
    updateDataAndDisplay(currentLoc);
};

const submitNewLocation = async (event) => {
    event.preventDefault();
    const text = document.getElementById("searchBar__text").value;
    const entryText = cleanText(text);
    if (!entryText.length) return;
    const locationIcon = document.querySelector(".fa-search");
    addSpinner(locationIcon);
    const coordsData = await getCoordsFromApi(entryText, currentLoc.getUnit());
    if (coordsData) {
        if (coordsData.cod === 200) {
            // success
            const myCoordsObj = {
                lat: coordsData.coord.lat,
                lon: coordsData.coord.lon,
                name: coordsData.sys.country ? `${coordsData.name}, ${coordsData.sys.country}` : coordsData.name
            };
            setLocationObject(currentLoc, myCoordsObj);
            updateDataAndDisplay(currentLoc);
        } else {
            displayApiError(coordsData);
        }
    } else {
        displayError("Connection Error", "Connection Error");
    }

};

const updateDataAndDisplay = async (locationObj) => {
    const weatherJson = await getWeatherFromCoords(locationObj);
    if (weatherJson) updateDisplay(weatherJson, locationObj);
};

