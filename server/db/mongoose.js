var mongoose = require('mongoose');
if (process.env.HOME === '/Users/Keanu1989') {
	var mongodbLogin = 'mongodb://localhost:27017/TodoApp';
} else {
	var {mongodbLogin} = require('./mongolab-login');	
}
// promise library to use
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || mongodbLogin);

module.exports = {
	mongoose
};