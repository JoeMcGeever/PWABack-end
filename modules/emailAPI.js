
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
	 * @returns {boolean} returns true
	 */
	async sendEmail(emailAddress) {
        console.log("Email needs to send")
        
        
        return false
        
        
        const sgMail = require('@sendgrid/mail')
            sgMail.setApiKey('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');
            const msg = {
            to: userEmail,
            from: 'localcommunity.co.uk',
            subject: 'Your issue has been assigned',
            text: 'Your issue has been assigned!',
            html: `<strong> The issue has been assigned. Sent to: "${emailAddress}".</strong>`,
        }
            sgMail.send(msg);
		return true
	}

}

export default Email

