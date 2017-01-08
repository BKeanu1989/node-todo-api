var mongoose = require('mongoose');

if (process.env.NODE_ENV === 'production') {
	process.env.MONGODB_URI = "mongodb://abc:hello-world@ds159188.mlab.com:59188/todo-api";
}

// promise library to use
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI);

module.exports = {
	mongoose
};