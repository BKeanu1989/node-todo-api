// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

// variable destructuring
// var user = {name:'Kevin_old', age: 33};
// var {name} = user;

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
	if (err) {
		return console.log('Unable to connect to mongo db server');
	}
	console.log('Connect to MongoDB server');
// only pointer
// db.collection('Todos').find()

	// deleteMany
	// db.collection('Todos').deleteMany({text: 'schlafen'}).then((result) => {
	// 	console.log(result);
	// });
	// deleteOne
	// db.collection('Todos').deleteOne({text: 'schlafen'}).then((result) => {
	// 	console.log(result);
	// });
	// findOneAndDelete
	db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
		console.log(result);
	});

	// db.close();
});