var mongoose = require('mongoose');
if (process.env.HOME === '/Users/Keanu1989') {
	var mongodbLogin = 'mongodb://localhost:27017/TodoApp';
}
if (process.env.HOME !== '/Users/Keanu1989') {
	var {mongodbLogin} = require('./mongolab-login');
	console.log(mongodbLogin);
}
// promise library to use
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || mongodbLogin);

module.exports = {
	mongoose
};