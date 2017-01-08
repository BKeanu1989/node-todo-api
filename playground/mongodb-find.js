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

	// db.collection('Todos').find({
	// 	_id: new ObjectID('58711e4c19755fae7ab73e26')
	// }).toArray().then((docs) => {
	// 	console.log('Todos');
	// 	console.log(JSON.stringify(docs, undefined, 2));
	// }, (err) => {
	// 	console.log('Unable to fetch todos', err);
	// });

	// 	db.collection('Todos').find().count().then((count) => {
	// 	console.log('Todos count');
	// 	console.log(JSON.stringify(count, undefined, 2));
	// }, (err) => {
	// 	console.log('Unable to fetch todos', err);
	// });
		db.collection('Todos').find().toArray().then((docs) => {

		// db.collection('Users').find().toArray().then((docs) => {
		// db.collection('Users').find({name: 'Dany'}).toArray().then((docs) => {
		console.log('User docs:');
		console.log(JSON.stringify(docs, undefined, 2));
	}, (err) => {
		console.log('Unable to fetch todos', err);
	});

	// db.close();
});