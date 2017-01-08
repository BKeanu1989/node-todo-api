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

	// db.collection('Todos').insertOne({
	// 	text: 'Something to do',
	// 	completed: false
	// }, (err, result) => {
	// 	if (err) {
	// 		return console.log('Unable to insert todo', err);
	// 	}

	// 	console.log(JSON.stringify(result.ops, undefined, 2));
	// });

	// db.collection('Users').insertOne({
	// 	name: 'Dany',
	// 	age: 56,
	// 	location: 'Berlin'
	// }, (err, result) => {
	// 	if (err) {
	// 		return console.log('Unable to insert user', err);
	// 	}

	// 	console.log(JSON.stringify(result.ops, undefined, 2));
	// 	console.log(JSON.stringify(result.ops[0]._id.getTimestamp(), undefined, 2));
	// });
	
	db.close();
});