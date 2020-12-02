
/** @module Issues */


import { extractCredentials } from '../modules/common.js'
import { get, all, run } from '../modules/mysql.js'
import Location from '../modules/locationAPI.js'
import Email from '../modules/emailAPI.js'


/**
 * Issues
 * ES6 module that handles creating, getting and updating issues.
 */
class Issue {
	/**
   * Create an issue object
   */
	constructor() {
		return (async() => {
			return this
		})()
	}
    
    
    /**
	 * creates a new issue
	 * @param {String} user the users username
	 * @param {String} title the title of the issue
	 * @param {String} location is the address /postcode of the issue
	 * @param {String} description is the issues description
	 * @returns {Boolean} returns true if the new issue has been added
	 */
	async newIssue(userID, title, location, description) {
		try {
            //no image yet -> for v2 of the api

  
            const locationClass = await new Location()
            const userCoords = await locationClass.getCoordinates(location)   
            
            description = description //Format the description (with newlines etc)
            
            let sql = `INSERT INTO issue(title, description, locationXCoord, locationYCoord, userID) VALUES("${title}", "${description}", ${userCoords[0]}, ${userCoords[1]}, "${userID}")`
			await run(sql) //insert the issue into the db
                       
            sql = `UPDATE accounts SET score = score + 10 WHERE userID = ${userID}`//append 10 to score
            await run(sql) //update the score of the user           
            return true
                        
		} catch(err) {
			console.log('module error')
			console.log(err)
			throw err
		}
	}

	/**
	 * Gets a specified issue by its id
	 * @param {int} id for the issue
	 * @returns {???} ???
	 */
	async getIssue(id) {
		const login = extractCredentials(token)
		let sql = `SELECT * FROM issues WHERE id="${id}";`
		try{
            const records = await get(sql)
            //CONVERT RECORDS TO JSON
        }catch(err){
            throw new Error(`The SQL query: "${sql}" failed`)
        }
		return records
	}
    
    
    /**
	 * Gets all recently added issues
	 * @param {int} ...
	 * @returns {??}...
	 */
	async getIssues(page) {
		//page for pagination / offset
		let sql = `SELECT * FROM issues;`
		try{
            const records = await get(sql)
            //CONVERT RECORDS TO JSON
        }catch(err){
            throw new Error(`The SQL query: "${sql}" failed`)
        }
		return records
	}
    
    
    
    /**
	 * Updates the status of an issue
	 * @param {issueID} the ID for the issue which is being updated
	 * @param {userID} the ID of the user who's updating the status
	 * @param {status} the new status of the issue
	 * @returns {bool} returns true if it succeeds
	 */
	async updateIssuesStatus(issueID, userID, status) {
        
        
        try {
        
        if(status != 'verified' || status != 'assigned' || status != 'resolved'){
            throw new Error('Status can only be either "verified", "assigned" or "resolved"')
        }
        
        
        
        let sql = `SELECT status FROM issue WHERE issueID = ${issueID}`
        const currentStatus = await get(sql) //validation based on the status change
        if(currentStatus==status){
            throw new Error(`The status is already "${status}"`)
        }
        
        
        
        sql = `UPDATE issue SET status = ${status} WHERE issueID = ${issueID}`
        await run(sql) //actually updates the status of the issue
        
        
        
        if(status=='verified'){
          sql = `UPDATE accounts SET score = score + 10 WHERE userID = ${userID}`//append 10 to score
          await run(sql)
        }else if(status=='assigned'){
            //send email here
            sql = `SELECT accounts.email FROM issue INNER JOIN accounts ON accounts.userID=issue.userID WHERE issue.issueID=${issueID}`
            let userEmail = await get(sql)
            //gets the email using an inner join (fk of userID)
            const emailClass = await new Email()
            await emailClass.sendEmail(userEmail)  //calls the send email function           
        }
        else if(status=='resolved'){
          sql = `UPDATE accounts SET score = score + 20 WHERE userID = ${userID}`//append 20 to score
          await run(sql)
          sql = `UPDATE accounts, (SELECT userID from issue WHERE issueID = ${issueID}) AS issue SET accounts.score = accounts.score + 50 WHERE accounts.userID = issue.userID`
          //append 50 to original users score
          await run(sql)
        }
        
        }catch(err){
            throw new Error(`The SQL query: "${sql}" failed`)
        }
    
    
		return true
	}

}

export default Issue
