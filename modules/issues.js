
/** @module Issues */


import { extractCredentials } from '../modules/common.js';
import { get, all, run } from '../modules/mysql.js';
import Location from '../modules/locationAPI.js';
import Email from '../modules/emailAPI.js';


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
			return this;
		})();
	}
    
    
    /**
	 * creates a new issue
	 * @param {String} user the users username
	 * @param {String} title the title of the issue
	 * @param {String} location is the address /postcode of the issue
	 * @param {String} description is the issues description
	 * @returns {Boolean} returns true if the new issue has been added
	 */
	async newIssue(userID, title, location, description, image) {
		try {
            //no image yet -> for v2 of the api

  
            const locationClass = await new Location();
            const userCoords = await locationClass.getCoordinates(location);   
            
            description = `${location} - ${description}`;
            let sql = `INSERT INTO issue(title, description, locationXCoord, locationYCoord, userID, status) VALUES("${title}", "${description}", ${userCoords[0]}, ${userCoords[1]}, "${userID}", "new")`;
            if(image != null){
                sql = `INSERT INTO issue(title, description, locationXCoord, locationYCoord, userID, status, image) VALUES("${title}", "${description}", ${userCoords[0]}, ${userCoords[1]}, "${userID}", "new", "${image}")`
            }
			await run(sql); //insert the issue into the db
                       
            sql = `UPDATE accounts SET score = score + 10 WHERE userID = ${userID}`;//append 10 to score
            await run(sql); //update the score of the user           
            return true;
                        
		} catch(err) {
			console.log('module error');
			console.log(err);
			throw err;
		}
	}
    
    
	/**
	 * Gets a specified issue by its id
	 * @param {int} id for the issue
	 * @returns {object} Returns the issue details
	 */
	async getIssue(id) {
        let sql = `SELECT * FROM issue WHERE issueID="${id}";`;  
        try{
            const records = await get(sql);
            return records;
        }catch(err){
            throw new Error(`The SQL query: "${sql}" failed`);
        }
	}
    
    
    /**
	 * Gets all recently added issues
	 * @param {int} which page the user wants
	 * @returns {[object]} Returns a list of all issues relevant to that page
	 */
	async getIssues(page) {
		//assume 5 elements per page
        const elementPerPage = 6;
        const offset = page * elementPerPage;
		let sql = `SELECT issueID, title, description, status FROM issue ORDER BY timeOfIssue DESC LIMIT ${elementPerPage} OFFSET ${offset};`;
		try{
            const records = await all(sql);
            return records;
        }catch(err){
            throw new Error(`The SQL query: "${sql}" failed`);
        }
		return records;
	}
    
    
    /**
	 * Gets all issues, ordered by closest to furthest
	 * @param {int} which page the user wants
	 * @param {[float, float]} the lat, long coordinates
	 * @returns {[object]} Returns a list of all issues relevant to that page
	 */
	async getIssuesDistance(page, coordinates) {
		//assume 6 elements per page
                
        
        const elementPerPage = 6;
        const offset = page * elementPerPage;
		let sql = `SELECT issueID, title, description, status, locationXCoord, locationYCoord FROM issue;`;
		try{
            const records = await all(sql);
            
            let order = [];
            
            
            let i = 0;
            //order relative to the coordinates given
            for (i; i < records.length; i++){

                //calculate the absolute distance between the 2 points
                let distance = Math.abs(Math.sqrt((Math.pow(coordinates[0]-records[i].locationXCoord, 2)) + (Math.pow(coordinates[1]-records[i].locationYCoord, 2))));
                
                order.push([i, distance]);
                
            }
               
            //bubble sort:
            
            i = 0;            
            var len = order.length;
            for (i = len-1; i>=0; i--){
            for(var j = 1; j<=i; j++){
                if(order[j-1][1]>order[j][1]){
                    var temp = order[j-1];
                    order[j-1] = order[j];
                    order[j] = temp;
                    }
                 }
           }
            
           
            
           let endread = offset-elementPerPage;
           
           console.log(endread);
            
            let returnRecords = [];
            
            console.log(order);
           
            
            i = offset - 1; //i represents the furthest element away for that page
            
            
            
           for(i; i!=endread-1; i--){ //append backwards so it goes from furthest to nearest 
//                console.log('id = ')
//                console.log(order[i][0])
// //                console.log("the distance away:")
//                console.log(order[i][1])
// //                console.log("the total record:")
//                console.log(records[order[endread][0]])

               try{
                   returnRecords.push(records[order[i][0]]);
               } catch {
                   continue; //if reached the end of the array (last page) and the element exceeds the limit, move on
               }
           }
            
                        
           return returnRecords.reverse();
        }catch(err){
            throw new Error(err);
        }
		return records;
	}
    
    
    
    /**
	 * Gets the total number of issues
	 * @returns {int} Returns the total number of issues
	 */
    async getIssueCount() {
        let sql = 'SELECT COUNT(issueID) as count FROM issue;';
        try{
            const countIssues = await get(sql);
            return countIssues.count;
        }catch(err){
            throw new Error(`The SQL query: "${sql}" failed`);
        }
        return countIssues;
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
            throw new Error('Status can only be either "verified", "assigned" or "resolved"');
        }

        try {
        
            
            console.log(status);
        
        let sql = `SELECT status FROM issue WHERE issueID = ${issueID}`;
        const currentStatus = await get(sql); //validation based on the status change
        
        console.log("current status = ");
        console.log(currentStatus.status);
        console.log("new status = ");
        console.log(status);
            
        if(currentStatus == null){
            throw new Error(`No issue has been found`);
        }
        if(currentStatus.status==status){
            throw new Error(`The status is already "${status}"`);
        }
        if(currentStatus.status=="new" && status != "verified"){
            throw new Error(`The status must be verified before being ${status}`);
        }
        if(currentStatus.status=="assigned" && status != "resolved"){
            throw new Error('the status can only be resolved from here');
        }
            
            
            
            
        if(status=="verified" || status =="assigned"){ //if the user wants to update the issue to verified / assigned
            sql = `SELECT userID FROM issue WHERE issueID = ${issueID}`; //but they are the original user
            let theIssuesUser = await get(sql);
            if(theIssuesUser.userID==userID){
                throw new Error('The user who created the issue cannot verify / be assigned to the task');
            }
        }  
            
                       
        if(status=="resolved"){ //if the user wants to update the issue to resolved  
            console.log("in resolved");
            console.log(status);
            sql = `SELECT userID, workedOnBy FROM issue WHERE issueID = ${issueID}`; //but it is not their issue to resolve
            let user = await get(sql);
            if(user.userID!=userID) throw new Error('Only the user who created the issue can resolve the issue');
            
            sql = `SELECT isCouncil FROM accounts WHERE userID = ${user.workedOnBy}`;
            let isCouncil = await get(sql);
            console.log(isCouncil);
            if(isCouncil.isCouncil==1) status = 'Resolved by Council';
        }
     
        console.log(status);
            
            console.log("here??");

        sql = `UPDATE issue SET status = "${status}" WHERE issueID = ${issueID}`;
        await run(sql); //actually updates the status of the issue
        console.log(`After update status statement, sql = ${sql}`);
        
            
        console.log("updated");
            
        
        
        if(status=='verified'){
          sql = `UPDATE accounts SET score = score + 10 WHERE userID = ${userID}`;//append 10 to score
          console.log(sql);
          await run(sql);
          console.log("Status has been changed to verified. +10 score to the user");
        }else if(status=='assigned'){
            //set the assigned user:
            sql = `UPDATE issue SET workedOnBy = ${userID} WHERE issueID = ${issueID}`;
            await run(sql);
            //send email here
            sql = `SELECT accounts.email FROM issue INNER JOIN accounts ON accounts.userID=issue.userID WHERE issue.issueID=${issueID}`;
            let userEmail = await get(sql);
            console.log("Status is assigned. Send email to:");
            console.log(userEmail.email);
            //gets the email using an inner join (fk of userID)
            const emailClass = await new Email();
            await emailClass.sendEmail(userEmail.email, issueID); //calls the send email function           
        }
        else if(status=='resolved' || status=='Resolved by Council'){
          sql = `UPDATE accounts SET score = score + 20 WHERE userID = ${userID}`;//append 20 to score (userID will be the user who created the issue in this instance)
          await run(sql);
          sql = `UPDATE accounts, (SELECT workedOnBy from issue WHERE issueID = ${issueID}) AS issue SET accounts.score = accounts.score + 50 WHERE accounts.userID = issue.workedOnBy`;
          //append 50 to the other users score 
          await run(sql);
        }
        
        }catch(err){
            throw new Error(err);
        }
    
    
		return true;
	}

}

export default Issue;
