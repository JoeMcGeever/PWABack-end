
/* issuesV2.js */

import Router from 'koa-router'

import Accounts from '../modules/accounts.js'
import Issues from '../modules/issues.js'

const router = new Router({ prefix: '/v2/issue' })

const hateos = {
                '/v1/issues' : 'POST - adds an new issue, Data must have userID, title, location, and a description',
                '/v2/issues' : 'POST - adds an new issue, Data must have userID, title, location, description and a base64 encoded image',
                '/v1/issues/5' : 'GET - gets an issue with the ID of 5',
                '/v1/issues/recent/3' : 'GET - gets the 3rd page of issues ordered by recently added'
            }
//'/v1/issues/distance/2' : 'GET - gets the 2nd page of issues ordered by nearest'



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




// adds a new issue with a base64 encoded picture
router.post('/', async ctx => {
	try {
		console.log('POST /issue')
		console.log(ctx.request.body)
		const data = JSON.parse(ctx.request.body)
        
        
		const issue = await new Issues()
 
        console.log(data.image)
        
        
		await issue.newIssue(data.userID, data.title, data.location, data.description, data.image)
		ctx.status = 201
		ctx.body = {status: 'success', msg: 'Issue created', 'further uses ' : hateos}
	} catch(err) {
		console.log('post error')
		console.log(err)
		ctx.status = 404
	  ctx.body = { err: err.message, 'uses ' : hateos }
	}
})











export default router