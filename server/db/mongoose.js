var mongoose = require('mongoose');
if (!process.env.MONGODB_URI) {
	var {mongodbLogin} = require('./mongolab-login');
	console.log(mongodbLogin);
}
// promise library to use
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || mongodbLogin || 'mongodb://localhost:27017/TodoApp');

module.exports = {
	mongoose
};