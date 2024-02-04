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
}

// loads current location from the local browser storage
export const getHomeLocation = () => {
    return localStorage.getItem("defaultWeatherLocation")
}

// uses regex to search for 2 spaces next to each other and removes them 
export const cleanText = (text) => {
    const regex = / {2,}/g;
    const entryText = text.replaceAll(regex, " ").trim();
    return entryText;
}