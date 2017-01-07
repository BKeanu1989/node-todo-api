// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
	if (err) {
		return console.log('Unable to connect to mongo db server');
	}
	console.log('Connect to MongoDB server');
	// findOneAndUpdate
	// db.collection('Todos').findOneAndUpdate({
	// 	_id: new ObjectID('5871115fc7f5a5257daf710d')
	// }, {
	// 	$set: {
	// 		text: 'done'
	// 	}
	// }, {
	// 		returnOriginal: false
	// 	}).then((result) => {
	// 	console.log(result);
	// });

	db.collection('Users').findOneAndUpdate({
		_id: new ObjectID('5871170cb3f4cb267cf92284')
	}, {
		$set: {
			name: 'Werner2'
		},
		$inc: {
			age: +1
		}
	}, {
		returnOriginal: false
	}
	).then((result) => {
		console.log(result);
	});

	// db.close();
});