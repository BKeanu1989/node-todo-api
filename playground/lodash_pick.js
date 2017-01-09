const _ = require('lodash');
var {User} = require('./../server/models/user');
var req = [];
req.body = {
	email: 'test@test.com',
	password: 'ijasdasd'
};
var user = new User(_.pick(req.body,['email', 'password']));
console.log(user);