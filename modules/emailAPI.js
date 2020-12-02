
/** @module email */


/**
 * email
 * ES6 module that handles sending emails to users
 */
class Email {
	/**
   * Create a location object
   */
	constructor() {
		return (async() => {
			return this
		})()
	}

    /**
	 * Uses API to send an email to a user
	 * @param {String} the email address to send to
	 * @returns {boolea} returns true if the function succeeds
	 */
	async sendEmail(emailAddress) {
        console.log("Email needs to send")
		return true
	}

}

export default Email

