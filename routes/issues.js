
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


let loggedInUserID //CHECK IF THIS IS THE BEST WAY TO DO THIS!!! 


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

router.get('/:issueID', async ctx => {
   try {
        const issueID = ctx.params.issueID
        const issue = await new Issue()
        const issueDetails = issue.getIssue(issueID)
        ctx.status=200
        ctx.body = {'DETAILS: ' : issueDetails, 'further uses ' : hateos}
	} catch(err) {
		console.log(err)
		ctx.status = 404
	  ctx.body = { err: err.message, 'uses ' : hateos }
	}
})

router.get('/recent/:page', async ctx => {
   try {
        const page = ctx.params.page
        const issue = await new Issue()
        const issueDetails = issue.getIssues(page)
        ctx.status=200
        ctx.body = {'DETAILS: ' : issueDetails, 'further uses ' : hateos}
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
             
        
        console.log(loggedInUserID)
        
		console.log('PATCH /issue')
		console.log(ctx.request.body)
		const data = ctx.request.body
		const issue = await new Issues()
		await issue.updateIssuesStatus(data.issueID, loggedInUserID, data.status) //note: loggedInUserID is set after the auth middleware
        //checktoken now returns the userID
		ctx.status = 201
		ctx.body = {status: 'success', msg: 'Issue updated', 'further uses ' : hateos}
	} catch(err) {
		console.log('patch error')
		console.log(err)
		ctx.status = 404
	  ctx.body = { err: err.message, 'uses ' : hateos }
	}
})





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



export default router
