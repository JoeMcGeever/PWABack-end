
/* common.js */

function extractCredentials(token) {
	try {
		console.log('checkAuth')
		if(token === undefined) throw new Error('no auth header')
		const [type, hash] = token.split(' ')
		if(type !== 'Basic') throw new Error('wrong auth type')
		const buffer = Buffer.from(hash, 'base64')
		const str = buffer.toString('utf8').trim()
		if(str.indexOf(':') === -1) throw new Error('invalid auth format')
		const [user, pass] = str.split(':')
		return {user, pass}
	} catch(err) {
		console.log(err)
		throw(err)
	}
}



export { extractCredentials }
