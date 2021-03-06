
/* accounts.js */

import Router from 'koa-router';
import Accounts from '../modules/accounts.js';

const router = new Router({ prefix: '/v1/accounts' });

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
                

// test route
router.get('/', async ctx => {
	ctx.status = 200;
	ctx.body = {account : {
			collection: 'accounts',
			url: `https://${ctx.host}/v1/accounts`,
            furtherUsage : hateos}};
});

// adds a new account
router.post('/', async ctx => {
	try {
		console.log('POST /v1/accounts');
		console.log(ctx.request.body);
		const data = JSON.parse(ctx.request.body);
        
        console.log(typeof(data));
        console.log(data.user);
        
        
        
        
		const account = await new Accounts();
		await account.register(data.user, data.pass, data.email, data.isCouncil, data.location);
		ctx.status = 201;
		ctx.body = {status: 'success', msg: 'account created', 'further usage ': hateos};
	} catch(err) {
		console.log('post error');
		console.log(err);
		ctx.status = 404;
	  ctx.body = { err: err.message, 'uses :' : hateos };
	}
});


//gets top 10 users by score
router.get('/top10', async ctx => {
    try {
		console.log('GET /v1/accounts/top10');

		const account = await new Accounts();
		const topTen = await account.getTopTen();
                
		ctx.status = 201;
		ctx.body = {status: 'success', top10: topTen, 'further usage ': hateos};
	} catch(err) {
		console.log('post error');
		console.log(err);
		ctx.status = 404;
	  ctx.body = { err: err.message, 'uses :' : hateos };
	}
});

// checks if credentials are valid
router.get('/:username', async ctx => {
	try {
		console.log(`/v1/accounts/${ctx.params.username}`);
		const token = ctx.request.headers.authorization;
        console.log(token);
		const account = await new Accounts();
		const validUser = await account.checkToken(token);
        console.log(validUser);
        console.log(ctx.params.username);
		if(validUser.username !== ctx.params.username) throw new Error('credentials don\'t match URL');
		ctx.body = {status: 'success', msg: `supplied credentials valid for user ${validUser.username}`, 'userID' : validUser.userID, "isCouncil" : validUser.isCouncil, 'further usage ': hateos};
	} catch(err) {
		console.log(err);
		ctx.status = 404;
	  ctx.body = { err: err.message, 'uses :' : hateos };
	}
});

export default router;
