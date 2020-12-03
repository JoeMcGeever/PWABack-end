
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
	 * @returns {object} Returns the issue details
	 */
	async getIssue(id) {
        let sql = `SELECT issueID, title, description, locationXCoord, locationYCoord, status, image, timeOfIssue FROM issue WHERE issueID="${id}";`  
        try{
            const records = await get(sql)
            return records
        }catch(err){
            throw new Error(`The SQL query: "${sql}" failed`)
        }
	}
    
    
    /**
	 * Gets all recently added issues
	 * @param {int} which page the user wants
	 * @returns {[object]} Returns a list of all issues relevant to that page
	 */
	async getIssues(page) {
		//assume 5 elements per page
        const elementPerPage = 5
        const offset = page * elementPerPage
		let sql = `SELECT issueID, title, description, locationXCoord, locationYCoord, status, image, timeOfIssue FROM issue ORDER BY timeOfIssue DESC LIMIT ${elementPerPage} OFFSET ${offset};`
		try{
            const records = await all(sql)
            return records
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
        
      
        
        
         if(!(status == 'verified' || status == 'assigned' || status == 'resolved')){ //status has to be one of these three strings
            throw new Error('Status can only be either "verified", "assigned" or "resolved"')
        }

        try {
        
        
        let sql = `SELECT status FROM issue WHERE issueID = ${issueID}`
        const currentStatus = await get(sql) //validation based on the status change
        
        console.log("current status = ")
        console.log(currentStatus.status)
        console.log("new status = ")
        console.log(status)
            
        if(currentStatus == null){
            throw new Error(`No issue has been found`)
        }
        if(currentStatus.status==status){
            throw new Error(`The status is already "${status}"`)
        }
        if(currentStatus.status=="new" && status != "verified"){
            throw new Error(`The status must be verified before being ${status}`)
        }
        if(currentStatus.status=="assigned" && status != "resolved"){
            throw new Error('the status can only be resolved from here')
        }
            
            
            
            
        if(status=="verified" || status =="assigned"){ //if the user wants to update the issue to verified / assigned
            sql = `SELECT userID FROM issue WHERE issueID = ${issueID}` //but they are the original user
            let theIssuesUser = await get(sql)
            if(theIssuesUser.userID==userID){
                throw new Error('The user who created the issue cannot verify / be assigned to the task')
            }
        }  
            
                       
        if(status=="resolved"){ //if the user wants to update the issue to resolved         
            sql = `SELECT userID FROM issue WHERE issueID = ${issueID}` //but it is not their issue to resolve
            let user = await get(sql)
            if(user.userID!=userID){
                throw new Error('Only the user who created the issue can resolve the issue')
            }
        }
     
        
            
            

        sql = `UPDATE issue SET status = "${status}" WHERE issueID = ${issueID}`
        await run(sql) //actually updates the status of the issue
        console.log(`After update status statement, sql = ${sql}`)
        
            
            
            
        
        
        if(status=='verified'){
          sql = `UPDATE accounts SET score = score + 10 WHERE userID = ${userID}`//append 10 to score
          console.log(sql)
          await run(sql)
          console.log("Status has been changed to verified. +10 score to the user")
        }else if(status=='assigned'){
            //set the assigned user:
            sql = `UPDATE issue SET workedOnBy = ${userID} WHERE issueID = ${issueID}`
            await run(sql)
            //send email here
            sql = `SELECT accounts.email FROM issue INNER JOIN accounts ON accounts.userID=issue.userID WHERE issue.issueID=${issueID}`
            let userEmail = await get(sql)
            console.log("Status is assigned. Send email to:")
            console.log(userEmail.email)
            //gets the email using an inner join (fk of userID)
            const emailClass = await new Email()
            await emailClass.sendEmail(userEmail.email, issueID)  //calls the send email function           
        }
        else if(status=='resolved'){
          sql = `UPDATE accounts SET score = score + 20 WHERE userID = ${userID}`//append 20 to score (userID will be the user who created the issue in this instance)
          await run(sql)
          sql = `UPDATE accounts, (SELECT workedOnBy from issue WHERE issueID = ${issueID}) AS issue SET accounts.score = accounts.score + 50 WHERE accounts.userID = issue.workedOnBy`
          //append 50 to the other users score 
          await run(sql)
        }
        
        }catch(err){
            throw new Error(err)
        }
    
    
		return true
	}

}

export default Issue
