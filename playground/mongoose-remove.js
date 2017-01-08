const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// without information about what docs have been removed
// Todo.remove({}).then((result) => {
// 	console.log(result);
// });

// Todo.findOneAndRemove({_id: '58726e8907c5cf778f7f6d36'}).then((doc) => {
// 	console.log(doc);
// });

Todo.findByIdAndRemove('5872854e6b6bb6d37ff3c4d7').then((doc) => {
	console.log(doc);
});