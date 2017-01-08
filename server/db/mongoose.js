var mongoose = require('mongoose');

if (process.env.NODE_ENV === 'production') {
	process.env.MONGODB_URI = require('mongolab-login.js');
}

// promise library to use
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI);

module.exports = {
	mongoose
};