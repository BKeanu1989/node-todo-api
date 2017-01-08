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
	text: 'Second test todo'
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