
/** @module email */


import Issue from './issues.js'
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const sgMail = require('@sendgrid/mail')



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
	async sendEmail(emailAddress, issueID) {
       
        //NEED TO IMPLEMENT (after front end has been started)
       //       The issue name, description and photo.
//                A link to the details page.
// A button to click to resolve the issue.
        
        
            const issueClass = await new Issue()
            const issueDetails = await issueClass.getIssue(issueID)
            
                
        
        let textToSend
        if(issueDetails.image == null){
            textToSend = `Your issue: '${issueDetails.title}' has been assigned! <br> Description: ${issueDetails.description} <br> <a href="bing.com">View in website</a> <br> <a href="google.com">Resolve it here!</a> `
        } else { //send with the image
             textToSend = `Your issue: '${issueDetails.title}' has been assigned! <br> Description: ${issueDetails.description} <br> <a href="bing.com">View in website</a> <br> <a href="google.com">Resolve it here!</a> `
        }
        
       
            sgMail.setApiKey('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');
            const msg = {
            to: emailAddress,
            from: 'josephmcgeever@hotmail.co.uk',
            subject: `"${issueDetails.title}" - issue has been assigned`,
            text: textToSend,
            html: `<strong> ${textToSend}.</strong>`,
        }
            sgMail
  .send(msg)
  .then(() => {
    console.log('Email sent')
  })
  .catch((error) => {
    console.error(error.response.body)
  })
		return true
	}

}

export default Email

