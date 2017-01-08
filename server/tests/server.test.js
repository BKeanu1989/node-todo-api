const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [{
	_id: new ObjectID(),
	text: 'First test todo'
}, {
	_id: new ObjectID(),
	text: 'Second test todo',
	completed: true,
	completedAt: 32312
}];

beforeEach((done) => {
	Todo.remove({}).then(() => {
		return Todo.insertMany(todos);
	}).then(() => done());
});

describe('POST /todos', () => {
	it('should create a new todo', (done) => {
		var text = 'Test Todo test';

		request(app)
			.post('/todos')
			// object get converted to json by supertest
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