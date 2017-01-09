const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = '123abc!';

// var hashedPassword = '$2a$10$tZoYWPe/hWMACu9GsBvLUu.xxpVztmnp8UE030IHX6RBpCW8roybi';

// bcrypt.compare(password, hashedPassword, (err, res) => {
// 	console.log(res);
// })

// var data = {
// 	id: 10
// };

// var token = jwt.sign(data, '123abc');
// console.log(token);

// var decoded = jwt.verify(token, '123abc');
// console.log('Decoded:', decoded);


// jwt.verify
// var message = 'Iam user #0';
// var hash = SHA256(message).toString();

// console.log(`Message: ${message}`);
// console.log(`Hash: ${hash}`);

// var data = {
// 	id: 4
// };

// var token = {
// 	data,
// 	hash: SHA256(JSON.stringify(data) + 'salt').toString()
// }

// var resultHash = SHA256(JSON.stringify(token.data) + 'salt').toString();

// if (resultHash === token.hash) {
// 	console.log('data was not changed');
// } else {
// 	console.log('data was changed');
// }