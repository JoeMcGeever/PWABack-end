
/* issues.js */

import Router from 'koa-router'

import Accounts from '../modules/accounts.js'
import Issues from '../modules/issues.js'

const router = new Router({ prefix: '/v1/issue' })

const hateos = {
                '/v1/issue' : 'POST - adds an new issue, Data must have userID, title, location, description',
                '/v2/issue' : 'POST - adds an new issue, Data must have userID, title, location, description and a base64 encoded image',
                '/v1/issue/5' : 'GET - gets an issue with the ID of 5',
                '/v1/issue/recent/3' : 'GET - gets the 3rd page of issues ordered by recently added',
                '/v1/issue/all/total' : 'GET - gets total number of issues in the system',
                '/v1/issue/patch' : 'PATCH - updates the status of an issue. Must have issueID, userID and status sent to it',
                '/v1/issue/distance/2?lat=<COORD_HERE>&long=<COORD_HERE>' : 'GET - gets the 2nd page of issues ordered by nearest.',
                '/v1/accounts' : 'POST - Adds a new account. Data must have username, password and email',
                '/v1/accounts/testUser' : 'GET - Checks if credentials are valid for testUser',
                '/v1/accounts/top10' : 'GET - Returns the top 10 users, ordered by score'
            }




async function middleware(ctx, next) {
	console.log('MIDDLEWARE')
	if(ctx.method !== 'GET') {
		const auth = ctx.request.headers.authorization
		try {
			const token = ctx.request.headers.authorization
			const account = await new Accounts()
			const validUser = await account.checkToken(token)
			await next()
		} catch(err) {
			ctx.status = 401
			ctx.body = { err: err.message }
		}
	} else {
		await next()
	}
}

router.use(middleware)

//test route
router.get('/', async ctx => {
	try {
        ctx.status = 200
		ctx.body = {issue: {
			collection: 'issues',
			url: `https://${ctx.host}/v1/issue`,
            furtherUsage : hateos}}
	} catch(err) {
		console.error(err)
		ctx.throw(404, err.message)
	}
})

//get an individual issue
router.get('/:issueID', async ctx => {
   try {
        const issueID = ctx.params.issueID
        const issue = await new Issues()
        const issueDetails = await issue.getIssue(issueID)
        if(issueDetails == null) throw new Error(`No issue found with id: ${issueID}`)
        ctx.status=200
        ctx.body = {issue : issueDetails, 'further uses ' : hateos}
	} catch(err) {
		console.log(err)
		ctx.status = 404
	  ctx.body = { err: err.message, 'uses ' : hateos }
	}
})

//gets total number of issues
router.get('/all/total', async ctx => {
   try {
        const issue = await new Issues()
        const issueCount = await issue.getIssueCount()
        ctx.status=200
        ctx.body = {numberOfIssues : issueCount, 'further uses ' : hateos}
	} catch(err) {
		console.log(err)
		ctx.status = 404
	  ctx.body = { err: err.message, 'uses ' : hateos }
	}
})

//gets a list of issues ordered by most recent with pagination
router.get('/recent/:page', async ctx => {
   try {
        let page = ctx.params.page
        page = Number(page) - 1 //subtract 1 from page so 0 can be used in offset
        if(!Number.isInteger(page)) throw new Error("Please choose a whole number (1 or above)")
        if(page < 0) throw new Error("Please choose a page number (1 or above)")
        const issue = await new Issues()
        const issueDetails = await issue.getIssues(page)
        if(issueDetails.length == 0) throw new Error("No results for this page")
        ctx.status=200
        ctx.body = {issues : issueDetails, 'further uses ' : hateos}
	} catch(err) {
		console.log(err)
		ctx.status = 404
	  ctx.body = { err: err.message, 'uses ' : hateos }
	}
})

//gets a list of issues ordered by closest with pagination
router.get('/distance/:page/:lat/:long', async ctx => {
    console.log("Distance")
   try {
        const page = ctx.params.page
        
        console.log(page)
    
        let coordinates = []
        
        coordinates[0] = ctx.params.lat
        coordinates[1] = ctx.params.long

        if(coordinates[0] == undefined || coordinates[1] == undefined) throw new Error('Please enter the lat and long coordinates')
            

       
        const issue = await new Issues()
        const issueDetails = await issue.getIssuesDistance(page, coordinates)

        ctx.status=200
        ctx.body = {issues : issueDetails, 'further uses ' : hateos}
	} catch(err) {
		console.log(err)
		ctx.status = 404
	  ctx.body = { err: err.message, 'uses ' : hateos }
	}
})


// adds a new issue (without a picture)
router.post('/', async ctx => {
	try {
		console.log('POST /issue')
		console.log(ctx.request.body)
		const data = JSON.parse(ctx.request.body)
        
        
        
		const issue = await new Issues()
		await issue.newIssue(data.userID, data.title, data.location, data.description, null)
		ctx.status = 201
		ctx.body = {status: 'success', msg: 'Issue created', 'further uses ' : hateos}
	} catch(err) {
		console.log('post error')
		console.log(err)
		ctx.status = 404
	  ctx.body = { err: err.message, 'uses ' : hateos }
	}
})



router.patch('/patch', async ctx => {
	try {
		console.log('PATCH /issue')
        //validate user id with the token
		const data = JSON.parse(ctx.request.body)
        
        console.log(data.status)
		const issue = await new Issues()
		await issue.updateIssuesStatus(data.issueID, data.userID, data.status) 
        
		ctx.status = 201
		ctx.body = {status: 'success', msg: 'Issue updated', 'further uses ' : hateos}
	} catch(err) {
		console.log('patch error')
		console.log(err)
		ctx.status = 404
	  ctx.body = { err: err.message, 'uses ' : hateos }
	}
})








export default router
