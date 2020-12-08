
/** @module Accounts */

import bcrypt from 'bcrypt-promise'

import { extractCredentials } from '../modules/common.js'
import { get, all, run } from '../modules/mysql.js'
import Location from '../modules/locationAPI.js'

const saltRounds = 10

/**
 * Accounts
 * ES6 module that handles registering accounts and logging in.
 */
class Accounts {
	/**
   * Create an account object
   */
	constructor() {
		return (async() => {
			return this
		})()
	}

    /**
	 * registers a new user
	 * @param {String} user the chosen username
	 * @param {String} pass the chosen password
	 * @param {String} email the chosen email
	 * @returns {Boolean} returns true if the new user has been added
	 */
	async register(user, pass, email, isCouncil, location) {
        
        
        const locationClass = await new Location()
	    const userCoords = await locationClass.getCoordinates(location)
        
		try {
			Array.from(arguments).forEach( val => {
                console.log(arguments)
				if(val.length === 0) throw new Error('Please enter all of the fields!')
			})
			let sql = `SELECT COUNT(userID) as records FROM accounts WHERE username="${user}";`
			const data = await get(sql)
			console.log('data: ', data)
			if(data.records !== 0) throw new Error(`username "${user}" already in use`)
			sql = `SELECT COUNT(userID) as records FROM accounts WHERE email="${email}";`
			const emails = await get(sql)
			console.log('emails: ', emails)
			if(emails.records !== 0) throw new Error(`email address "${email}" is already in use`)
			pass = await bcrypt.hash(pass, saltRounds)
			console.log(`password length: ${pass.length}`)
			sql = `INSERT INTO accounts(username, password, email, isCouncil, locationXCoord, locationYCoord) VALUES("${user}", "${pass}", "${email}", ${isCouncil}, ${userCoords[0]}, ${userCoords[1]})`
			await run(sql)
			return true
		} catch(err) {
			console.log('module error')
			console.log(err)
			throw err
		}
	}

    
    
    /**
	 * Gets the top 10 users ordered by score
	 * @returns {??} returns the top 10 users ordered by score
	 */
	async getTopTen() {
                
		try {

			const sql = 'SELECT username, score from accounts ORDER BY score desc limit 10;' //gets top 10 users
            const topTen = await all(sql)
            return topTen
            
		} catch(err) {
			console.log('module error')
			console.log(err)
			throw err
		}
	}
	

	/**
	 * checks to see if a set of login credentials are valid
	 * @param {String} token the basic auth token
	 * @returns {int} returns the users ID if credentials are valid
	 */
	async checkToken(token) {
		const login = extractCredentials(token)
		let sql = `SELECT userID, username FROM accounts WHERE username="${login.user}";`
		const records = await get(sql)
		if(records == null) throw new Error(`username "${login.user}" not found`)
		sql = `SELECT password FROM accounts WHERE username = "${login.user}";`
		const record = await get(sql)
		const valid = await bcrypt.compare(login.pass, record.password)
		if(valid === false) throw new Error(`invalid password for account "${login.user}"`)
        console.log(records)
		return records
	}

}

export default Accounts

