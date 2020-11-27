
/* foo.js */

import Router from 'koa-router'

import Accounts from '../modules/accounts.js'

const router = new Router({ prefix: '/foo' })

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
		ctx.body = { status: 'success', msg: 'you are viewing a secure route which requires valid credentials' }
	} catch(err) {
		console.error(err)
		ctx.throw(404, err.message)
	}
})

export default router
