
/* index.js */


// import Email from './modules/emailAPI.js'






import Koa from 'koa'

import router from './routes/routes.js'
import bodyParser from 'koa-bodyparser'

import koaBody from 'koa-body'
 



var app = new Koa()

app.use(koaBody({
    multipart: true,
    formLimit: "10mb",
    jsonLimit: "10mb",
    textLimit: "10mb",
    enableTypes: ['json', 'form', 'text']
}))


app.use(bodyParser({
    formlimit: 10,
    jsonLimit : 10,
    textLimit : 10
}))

// app.use ((bodyParser ({  enabletypes:[' json ', ' form ', ' text '],  formlimit: "10MB",  querystring:{    parameterlimit:100000000000000  }})))



app.keys = ['darkSecret']

const defaultPort = 8080
const port = process.env.PORT || defaultPort
app.use(router.routes())
app.use(router.allowedMethods())





// app.use(bodyParser.json({limit: '50mb'}));
// app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));




// const emailTest = await new Email()
// await console.log(emailTest.sendEmail('mcgeevej@uni.coventry.ac.uk', 1))


app.listen(port, async() => console.log(`listening on port ${port}`))
