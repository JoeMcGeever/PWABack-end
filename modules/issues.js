
/** @module Issues */


import { extractCredentials } from '../modules/common.js'
import { get, all, run } from '../modules/mysql.js'


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
	 * @param {String} location is the address of the issue ??? Address?? Coords??
	 * @param {String} description is the issues description
	 * @param {????} description is the issues description
	 * @returns {Boolean} returns true if the new issue has been added
	 */
	async newIssue(user, title, location, description, image) {
		try {
            //maybe keep image out -> for v2 of the api
            //DATE OF CREATION
			//relevant sql here
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
	 * @param {String} token the basic auth token
	 * @returns {String} returns the username if credentials are valid
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

}

export default Issues
