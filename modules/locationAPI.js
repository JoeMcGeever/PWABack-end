
/** @module location */


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
			return this
		})()
	}

    /**
	 * Uses API to return the coordinates
	 * @param {String} the address / postcode to be converted
	 * @returns {object} returns the coordinates (x, y)
	 */
	async getCoordinates(location) {
        const coordinates = [0.0, 0.0]
		return coordinates
	}

}

export default Location

