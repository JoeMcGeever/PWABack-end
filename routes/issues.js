
/* issues.js */

import Router from 'koa-router'

import Accounts from '../modules/accounts.js'
import Issues from '../modules/issues.js'

const router = new Router({ prefix: '/v1/issue' })

const hateos = {
                '/v1/issues' : 'POST - adds an new issue, Data must have userID, title, location, description and an optional image',
                '/v1/issues/5' : 'GET - gets an issue with the ID of 5',
                '/v1/issues/recent/3' : 'GET - gets the 3rd page of issues ordered by recently added'
            }
//'/v1/issues/distance/2' : 'GET - gets the 2nd page of issues ordered by nearest'


let loggedInUserID //stores the current logged in user ID -> used for updating status of issues (set to null after being used)


async function middleware(ctx, next) {
	console.log('MIDDLEWARE')
	if(ctx.method !== 'GET') {
		const auth = ctx.request.headers.authorization
		try {
			const token = ctx.request.headers.authorization
			const account = await new Accounts()
			const validUser = await account.checkToken(token)
            loggedInUserID = validUser.userID //set the loggedInUserID variable to be the userID 
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
			url: `https://${ctx.host}/v1/issues`,
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
        ctx.status=200
        ctx.body = {'issue: ' : issueDetails, 'further uses ' : hateos}
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
        ctx.body = {'issues: ' : issueDetails, 'further uses ' : hateos}
	} catch(err) {
		console.log(err)
		ctx.status = 404
	  ctx.body = { err: err.message, 'uses ' : hateos }
	}
})

//gets a list of issues ordered by closest with pagination
// router.get('/distance/:page', async ctx = > {
//    try {
//         const page = ctx.params.page
//         const issue = await new Issue()
//         const issueDetails = issue.getIssuesDistance(page)
//         ctx.status=200
//         ctx.body = {'DETAILS: ' : issueDetails, 'further uses ' : hateos}
// 	} catch(err) {
// 		console.log(err)
// 		ctx.status = 404
// 	  ctx.body = { err: err.message, 'uses ' : hateos }
// 	}
// })


// adds a new issue (without a picture)
router.post('/', async ctx => {
	try {
		console.log('POST /issue')
		console.log(ctx.request.body)
		const data = ctx.request.body
        
        
        //userID should be sent from client (saved in local storage on client side)
        
		const issue = await new Issues()
		await issue.newIssue(data.userID, data.title, data.location, data.description)
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
             
        
        //console.log(loggedInUserID)
        
		console.log('PATCH /issue')
		console.log(ctx.request.body)
		const data = ctx.request.body
		const issue = await new Issues()
		await issue.updateIssuesStatus(data.issueID, loggedInUserID, data.status) //note: loggedInUserID is set after the auth middleware
        //checktoken now returns the userID
        loggedInUserID = null //set the logged in user ID to be null again
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
