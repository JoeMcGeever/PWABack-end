
/* accounts.js */

import Router from 'koa-router'
import Accounts from '../modules/accounts.js'

const router = new Router({ prefix: '/accounts' })

// test route
router.get('/', async ctx => {
	ctx.status = 200
  ctx.body = {status: 'success', msg: 'server running'}
})

// adds a new account
router.post('/', async ctx => {
	try {
		console.log('POST /accounts')
		console.log(ctx.request.body)
		const data = ctx.request.body
		const account = await new Accounts()
		await account.register(data.username, data.password, data.email)
		ctx.status = 201
		ctx.body = {status: 'success', msg: 'account created'}
	} catch(err) {
		console.log('post error')
		console.log(err)
		ctx.status = 404
	  ctx.body = { err: err.message }
	}
})

// checks if credentials are valid
router.get('/:username', async ctx => {
	try {
		console.log(`/accounts/${ctx.params.username}`)
		const token = ctx.request.headers.authorization
		const account = await new Accounts()
		const validUser = await account.checkToken(token)
		if(validUser !== ctx.params.username) throw new Error('credentials don\'t match URL')
		ctx.body = {status: 'success', msg: `supplied credentials valid for user ${validUser}`}
	} catch(err) {
		console.log(err)
		ctx.status = 404
	  ctx.body = { err: err.message }
	}
})

export default router
