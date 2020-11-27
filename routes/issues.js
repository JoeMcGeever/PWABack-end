
/* issues.js */

import Router from 'koa-router'

import Accounts from '../modules/accounts.js'
import Issues from '../modules/issues.js'

const router = new Router({ prefix: 'v1/issue' })

const hateos = issue: {
			collection: 'issues',
			url: `https://${ctx.host}/v1/issues`
            furtherUsage : {
                `https://${ctx.host}/v1/issues/:issueID` : 'GET - gets an issue from the given ID',
                `https://${ctx.host}/v1/issues/recent/3` : 'GET - gets the 3rd page of issues ordered by recently added',
                //`https://${ctx.host}/v1/issues/distance/2` : 'GET - gets the 2nd page of issues ordered by nearest'
            }
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

router.get('/', async ctx => {
	try {
        ctx.status = 200
		ctx.body = hateos
	} catch(err) {
		console.error(err)
		ctx.throw(404, err.message)
	}
})

router.get('/:issueID', async ctx = > {
   try {
        const issueID = ctx.params.issueID
        const issue = await new Issue()
        const issueDetails = issue.getIssue(issueID)
        ctx.status=200
        ctx.body = issueDetails
	} catch(err) {
		console.log(err)
		ctx.status = 404
	  ctx.body = { err: err.message }
	}
})

router.get('/recent/:page', async ctx = > {
   try {
        const page = ctx.params.page
        const issue = await new Issue()
        const issueDetails = issue.getIssues(page)
        ctx.status=200
        ctx.body = issueDetails
	} catch(err) {
		console.log(err)
		ctx.status = 404
	  ctx.body = { err: err.message }
	}
})



// adds a new issue
router.post('/', async ctx => {
	try {
		console.log('POST /issue')
		console.log(ctx.request.body)
		const data = ctx.request.body
		const issue = await new Issues()
		await issue.newIssue(data.user, data.title, data.location, data.description, data.image)
		ctx.status = 201
		ctx.body = {status: 'success', msg: 'Issue created', hateos}
	} catch(err) {
		console.log('post error')
		console.log(err)
		ctx.status = 404
	  ctx.body = { err: err.message }
	}
})



router.patch('/patch', async ctx => {
	try {
		console.log('PATCXH /issue')
		console.log(ctx.request.body)
		const data = ctx.request.body
		const issue = await new Issues()
		await issue.newIssue(data.user, data.title, data.location, data.description, data.image)
		ctx.status = 201
		ctx.body = {status: 'success', msg: 'Issue updated', hateos}
	} catch(err) {
		console.log('post error')
		console.log(err)
		ctx.status = 404
	  ctx.body = { err: err.message }
	}
})





// router.get('/distance/:page', async ctx = > {
//    try {
//         const page = ctx.params.page
//         const issue = await new Issue()
//         const issueDetails = issue.getIssuesDistance(page)
//         ctx.status=200
//         ctx.body = issueDetails
// 	} catch(err) {
// 		console.log(err)
// 		ctx.status = 404
// 	  ctx.body = { err: err.message }
// 	}
// })



export default router
