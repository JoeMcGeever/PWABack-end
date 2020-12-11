
/* index.js */


// import Email from './modules/emailAPI.js'






import Koa from 'koa'

import router from './routes/routes.js'


import bodyParser from 'koa-bodyparser' //for 413 error
import koaBody from 'koa-body' //for 413 error
 

var app = new Koa()

//note: if below is used, then 504 error is returned when adding an issue without an image
// app.use(koaBody({
//     //multipart: true,
//     formLimit: "10mb",
//     jsonLimit: "10mb",
//     textLimit: "10mb",
//     enableTypes: ['json', 'form', 'text']
// }))


// app.use(bodyParser({
//     formlimit: '10mb',
//     jsonLimit : '10mb',
//     textLimit : '10mb'
// }))

// app.use ((bodyParser ({  enabletypes:[' json ', ' form ', ' text '],  formlimit: "10MB",  querystring:{    parameterlimit:100000000000000  }})))



app.keys = ['darkSecret']

const defaultPort = 8080
const port = process.env.PORT || defaultPort
app.use(router.routes())
app.use(router.allowedMethods())


// const emailTest = await new Email()
// await console.log(emailTest.sendEmail('mcgeevej@uni.coventry.ac.uk', 1))


app.listen(port, async() => console.log(`listening on port ${port}`))
