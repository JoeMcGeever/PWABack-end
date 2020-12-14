
/* index.js */



import Koa from 'koa'

import router from './routes/routes.js'


import bodyParser from 'koa-bodyparser' //for 413 error
import koaBody from 'koa-body' //for 413 error
 

var app = new Koa()




app.keys = ['darkSecret']

const defaultPort = 8080
const port = process.env.PORT || defaultPort
app.use(router.routes())
app.use(router.allowedMethods())



app.listen(port, async() => console.log(`listening on port ${port}`))
