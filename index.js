
/* index.js */


// import Email from './modules/emailAPI.js'






import Koa from 'koa'

import router from './routes/routes.js'



const app = new Koa()
app.keys = ['darkSecret']

const defaultPort = 8080
const port = process.env.PORT || defaultPort
app.use(router.routes())
app.use(router.allowedMethods())






// const emailTest = await new Email()
// await console.log(emailTest.sendEmail('mcgeevej@uni.coventry.ac.uk', 1))


app.listen(port, async() => console.log(`listening on port ${port}`))
