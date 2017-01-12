const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateTodos);
beforeEach(populateUsers);

describe('POST /todos', () => {
	it('should create a new todo', (done) => {
		var text = 'Test Todo test';

		request(app)
			.post('/todos')
			// object gets converted to json by supertest
			.send({text})
			.expect(200)
			.expect((res) => {
				expect(res.body.text).toBe(text);
			})
			.end((err, res) => {
				if (err) {
					return done(err);
				}

				Todo.find().then((todos) => {
					expect(todos.length).toBe(3);
					var lastItem = todos.slice(-1)[0];
					expect(lastItem.text).toBe(text);
					done();
				}).catch((err) => {
					done(err);
				})
			});
	});

	it('should not create a new todo with invalid data', (done) => {
		var text = '';

		request(app)
			.post('/todos')
			.send({text})
			.expect(400)
			.end((err, res) => {
				if (err) return done(err);

				Todo.find().then((todos) => {
					expect(todos.length).toBe(2);
					done();
				}).catch((err) => done(err));
				
			});
	});
});

describe('GET /todos', () => {
	it('should get all todos', (done) => {
		request(app)
			.get('/todos')
			.expect(200)
			.expect((res) => {
				expect(res.body.todos.length).toBe(2);
			})
			.end(done);
	});
});

describe('GET /todos/:id', () => {
	it('should return todo doc', (done) => {
		request(app)
			.get(`/todos/${todos[0]._id.toHexString()}`)
			.expect(200)
			.expect((res) => {
				expect(res.body.todo.text).toBe(todos[0].text);
			})
			.end(done);
	});
	it('should return 404 if todo not found', (done) => {
		// 404
		var id = new ObjectID().toHexString();
		request(app)
			.get(`/todos/${id}`)
			.expect(404)
			// not necessary
			.expect((res) => {
				expect(res.body.todo).toNotExist();
			})
			.end(done);
	});

	it('should return 404 for non object id', (done) => {
		// get /todos/123
		var id = 123;
		request(app)
			.get(`/todos/${id}`)
			.expect(404)
			// not necessary
			.expect((res) => {
				expect(res.body.todo).toNotExist();
			})
			.end(done);
	});

});

describe('DELETE /todos/:id', () => {
	it('should remove a todo item by id', (done) => {
		var id = todos[0]._id.toHexString();

		request(app)
			.delete(`/todos/${id}`)
			.expect(200)
			.expect((res) => {
				expect(res.body.todo._id).toBe(id);
			})
			.end((err, res) => {
				if (err) return done(err);

				// query database using findbyid
				Todo.findById(id).then((todo) => {
					expect(todo).toNotExist();
					done();
				}).catch((err) => done(err));
			});
	}); 

	it('should return 404 if todo not found', (done) => {
		var id = new ObjectID();

		request(app)
			.delete(`/todos/${id}`)
			.expect(404)
			.end(done);
	});

	it('should return 404 if object id is invalid', (done) => {
		var id = 123;
		request(app)
			.delete(`/todos/${id}`)
			.expect(404)
			.end(done);
	});
});

describe('PATCH /todos/:id', () => {
	it('should update the todo', (done) => {
		var id = todos[0]._id.toHexString();
		var testBody = {
			text: 'update text via test',
			completed: true
		}
		request(app)
			.patch(`/todos/${id}`)
			.send(testBody)
			.expect(200)
			.expect((res) => {
				expect(res.body.todo.text).toBe(testBody.text);
				expect(res.body.todo.completed).toBe(true);
				expect(res.body.todo.completedAt).toBeA('number');
			})
			.end((err, res) => {
				if (err) return done(err);

				Todo.findById(id).then((todo) => {
					expect(todo.text).toBe(testBody.text);
					expect(todo.completed).toBe(true);
					expect(todo.completedAt).toBeA('number');
					done();
				}).catch((err) => {
					done(err);
				});

			})
	});
	it('should clear completedAt when todo is not completed', (done) => {
		var id = todos[1]._id.toHexString();
		var testBody = { completed: false }
		request(app)
			.patch(`/todos/${id}`)
			.send(testBody)
			.expect(200)
			.expect((res) => {
				expect(res.body.todo.completed).toBe(false);
				expect(res.body.todo.completedAt).toNotExist();
			})
			.end((err, res) => {
				if (err) return done(err);

				Todo.findById(id).then((todo) => {
					expect(todo.completed).toBe(false);
					expect(todo.completedAt).toNotExist();
					done();
				}).catch((err) => done(err));
			});
	});
});

describe('GET /users/me', () => {
	it('should return user if authenticated', (done) => {
		request(app)
			.get('/users/me')
			.set('x-auth', users[0].tokens[0].token)
			.expect(200)
			.expect((res) => {
				expect(res.body._id).toBe(users[0]._id.toHexString());
				expect(res.body.email).toBe(users[0].email);
			})
			.end(done);
	});

	it('should return 401 if not authenticated', (done) => {
		request(app)
			.get('/users/me')
			.expect(401)
			.expect((res) => {
				expect(res.body).toEqual({});
			})
			.end(done);
	});
});

describe('POST /users', () => {
	it('should create a user', (done) => {
		var email = 'example@example.com';
		var password = 'pass123';

		request(app)
			.post('/users')
			.send({email, password})
			.expect(200)
			.expect((res) => {
				expect(res.body._id).toExist();
				expect(res.body.email).toExist();
			})
			.end((err,res) => {
				if (err) done(err);
				User.findOne({email}).then((user) => {
					expect(user.email).toBe(email);
					expect(user.password).toNotBe(password);
					done();
				}).catch((err) => {
					done(err);
				});
			});

	});

	it('should return validation errors if request invalid', (done) => {
		var email = 'failemail.com';
		var password = 'pass123';

		request(app)
			.post('/users')
			.send({email, password})
			.expect(400)
			.end(done);
	});

	it('should not create user if email in use', (done) => {
		var email = users[0].email;
		var password = 'pass123';

		request(app)
			.post('/users')
			.send({email, password})
			.expect(400)
			.end(done);
	});
});

describe('POST /users/login', () => {
	it('should login user and return auth token', (done) => {
		request(app)
			.post('/users/login')
			.send({
				email: users[1].email,
				password: users[1].password
			})
			.expect(200)
			.expect((res) => {
				expect(res.headers['x-auth']).toExist();
			})
			.end((err, res) => {
				if (err) return done(err);

				User.findById(users[1]._id).then((user) => {
					expect(user.tokens[0]).toInclude({
						access: 'auth',
						token: res.headers['x-auth']
					});
					done();
				}).catch((err) => done(err));
			})
	});

	it('should reject invalid login', (done) => {
		request(app)
			.post('/users/login')
			.send({
				email: users[1].email,
				password: 'wrong'
			})
			.expect(400)
			.expect((res) => {
				expect(res.headers['x-auth']).toNotExist();
			})
			.end((err, res) => {
				if (err) return done(err);
				User.findById(users[1]._id).then((user) => {
					expect(user.tokens.length).toBe(0)
					done();
				}).catch((err) => done(err));
			});
	});

});


describe('DELETE /users/me/token', () => {
	it('should remove auth token on logout', (done) => {
		var token = users[0].tokens[0].token;
		request(app)
			.delete('/users/me/token')
			.set('x-auth', token)
			.expect(200)
			.expect((res) => {
				expect(res.headers['x-auth']).toNotExist();
			})
			.end((err, res) => {
				if (err) return done(err);
				User.findByToken(token).then((user) => {
					expect(user).toNotExist();
					done();
				}).catch((err) => done(err));
			});			
	});
});