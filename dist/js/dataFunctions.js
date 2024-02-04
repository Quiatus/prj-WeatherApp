const WEATHER_API_KEY = "c492e3dc4266cea7184bb276fcd47f58";

// locationObj is an instance of class Current Locaton. coordsObj passes teh current location passed from main function
export const setLocationObject = (locationObj, coordsObj) => {
    // Destructuring assignment 
    const { lat, lon, name, unit } = coordsObj;
    locationObj.setLat(lat);
    locationObj.setLon(lon);
    locationObj.setName(name);
    if ( unit )  {
        locationObj.setUnit(unit)
    }
};

// loads current location from the local browser storage
export const getHomeLocation = () => {
    return localStorage.getItem("defaultWeatherLocation")
};

export const getWeatherFromCoords = async (locationObj) => {
    const lat = locationObj.getLat();
    const lon = locationObj.getLon();
    const units = locationObj.getUnit();

    const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=${units}&appid=${WEATHER_API_KEY}`;
    try {
        const weatherStream = await fetch(url);
        const weatherJson = await weatherStream.json()
        return weatherJson;
    } catch (err) {
        console.error(err);
    }
};

// get current forecast json from API 
export const getCoordsFromApi = async (entryText, units) => {
    const regex = /^d+$/g;
    const flag = regex.test(entryText) ? "zip" : "q";
    const url = `https://api.openweathermap.org/data/2.5/weather?${flag}=${entryText}&units=${units}&appid=${WEATHER_API_KEY}`;
    const encodedUrl = encodeURI(url);
    try {
        const dataStream = await fetch(encodedUrl);
        const jsonData = await dataStream.json();
        console.log(jsonData)
        return jsonData;
    } catch (err) {
        console.error(err.stack);
    }
}

// uses regex to search for 2 spaces next to each other and removes them 
export const cleanText = (text) => {
    const regex = / {2,}/g;
    const entryText = text.replaceAll(regex, " ").trim();
    return entryText;
};