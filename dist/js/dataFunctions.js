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