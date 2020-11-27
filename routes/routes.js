
/* routes.js */

import Router from 'koa-router'
import bodyParser from 'koa-body'
// import cors from 'koa-cors'

import accounts from'./accounts.js'
import issues from'./issues.js'

async function custom404(ctx, next) {
	try {
		await next()
		const status = ctx.status || 404
		if(status === 404) ctx.throw(404)
	} catch(err) {
		ctx.status = 404
		ctx.body = { status: 404, msg: 'route not found' }
	}
}

async function cors(ctx, next) {
	console.log('CORS')
	ctx.set('Access-Control-Allow-Origin', '*')
  ctx.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
  ctx.set('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
  ctx.set('Access-Control-Allow-Credentials', true)
	await next()
}

const router = new Router()

// router.use(custom404)
// router.use(cors({origin: '*'}))
router.use(cors)
router.use(bodyParser())

const routes = [accounts, foo]
for (const route of routes) {
	router.use(route.routes())
	router.use(route.allowedMethods())
}

export default router
