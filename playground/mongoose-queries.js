const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// var id = '58724ea91baffbaf69a5a38311';

// if (!ObjectID.isValid(id)) {
// 	console.log('ID not valid');
// }

// // array
// Todo.find({
// 	// with mongoose new ObjectID is not necessary
// 	_id: id
// }).then((todos) => {
// 	console.log('Todos:', todos);
// });

// // object
// Todo.findOne({
// 	_id: id
// }).then((todo) => {
// 	console.log('Todo:', todo);
// });

// Todo.findById(id).then((todo) => {
// 	if (!todo) {
// 		return console.log('Id not found');
// 	}
// 	console.log('Find todo by id:', todo);
// }).catch((err) => {
// 	console.log(err);
// });

var Userid = '587182a08a71d9f44331af75';

User.findById(Userid).then((user) => {
	if (!user) return console.log('User not found');
	console.log('User found by id:', user);
}).catch((err) => {
	console.log(err);
})