
/* issuesV2.js */

import Router from 'koa-router';

import Accounts from '../modules/accounts.js';
import Issues from '../modules/issues.js';

const router = new Router({ prefix: '/v2/issue' });

const hateos = {
                '/v1/issue' : 'POST - adds an new issue, Data must have userID, title, location, description',
                '/v2/issue' : 'POST - adds an new issue, Data must have userID, title, location, description and a base64 encoded image',
                '/v1/issue/5' : 'GET - gets an issue with the ID of 5',
                '/v1/issue/recent/3' : 'GET - gets the 3rd page of issues ordered by recently added',
                '/v1/issue/all/total' : 'GET - gets total number of issues in the system',
                '/v1/issue/patch' : 'PATCH - updates the status of an issue. Must have issueID, userID and status sent to it',
                '/v1/issue/distance/2?lat=<COORD_HERE>&long=<COORD_HERE>' : 'GET - gets the 2nd page of issues ordered by nearest.',
                '/v1/accounts' : 'POST - Adds a new account. Data must have username, password and email',
                '/v1/accounts/testUser' : 'GET - Checks if credentials are valid for testUser',
                '/v1/accounts/top10' : 'GET - Returns the top 10 users, ordered by score'
            };



async function middleware(ctx, next) {
	console.log('MIDDLEWARE');
	if(ctx.method !== 'GET') {
		const auth = ctx.request.headers.authorization;
		try {
			const token = ctx.request.headers.authorization;
			const account = await new Accounts();
			const validUser = await account.checkToken(token);
			await next();
		} catch(err) {
			ctx.status = 401;
			ctx.body = { err: err.message };
		}
	} else {
		await next();
	}
}

router.use(middleware);




// adds a new issue with a base64 encoded picture
router.post('/', async ctx => {
	try {
		console.log('POST /issue');
		console.log(ctx.request.body);
		const data = JSON.parse(ctx.request.body);
        
        
		const issue = await new Issues();
 
        console.log(data.image);
        
        
		await issue.newIssue(data.userID, data.title, data.location, data.description, data.image);
		ctx.status = 201;
		ctx.body = {status: 'success', msg: 'Issue created', 'further uses ' : hateos};
	} catch(err) {
		console.log('post error');
		console.log(err);
		ctx.status = 404;
	  ctx.body = { err: err.message, 'uses ' : hateos };
	}
});











export default router;