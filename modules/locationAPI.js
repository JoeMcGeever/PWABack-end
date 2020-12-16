
/** @module location */

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const NodeGeocoder = require('node-geocoder');


const options = {
  provider: 'google',
  apiKey: 'AIzaSyDxCUp6KciwmfIJYsU0KYg4YSeuz9YOk8s', 
  formatter: null // 'gpx', 'string', ...
};



/**
 * location
 * ES6 module that handles the location based api
 */
class Location {
	/**
   * Create a location object
   */
	constructor() {
		return (async() => {
			return this;
		})();
	}

    /**
	 * Uses API to return the coordinates
	 * @param {String} the address / postcode to be converted
	 * @returns {object} returns the coordinates (x, y)
	 */
	async getCoordinates(location) {
        try{
            const geocoder = NodeGeocoder(options);
            const res = await geocoder.geocode(location);
        
            console.log(res);
        
            const x = res[0].latitude;
            const y = res[0].longitude;
        
            return [x, y];
            
        } catch{
            console.log("invald request");
            return [0.0, 0.0];
        }
       
	}

}

export default Location;

