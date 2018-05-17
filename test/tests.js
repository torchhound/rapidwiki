const test = require('tape');
const request = require('supertest');
const Sequelize = require('sequelize');
const mocha = require('mocha');
var fs = require('fs');

const app = require('../index');

describe('Wiki Integration Test', function() {
	before(function() {
		var sequelize = new Sequelize('wikiDb', null, null, {
			dialect: "sqlite",
			storage: './wiki.sqlite',
		});

		sequelize.authenticate()
			.then(function(data) {
				console.log('Database connection successful!');
			}, function (err) {
				console.log('Unable to connect to the database:', err);
			}
		);

		sequelize.Page = sequelize.import('../models/Page');
		sequelize.Diff = sequelize.import('../models/Diff');
		sequelize.User = sequelize.import('../models/User');

		sequelize.sync({ force: true })
			.then(function(data) {
				console.log('Database synced!');
			}, function (err) {
				console.log('An error occurred while creating the table:', err);
			}
		);		
	});

	test('post /api/auth/signup', assert => {
		request(app)
			.post('/api/auth/signup')
			.send({"username": "fake@faker.net", "password": "fake"})
			.expect(200)
			.end((err, res) => {
				if (err) return assert.fail(err);
				assert.pass('Created a new user successfully, test passed!');
				assert.end();
			})
	});	

	test('get /', assert => {
	  request(app)
	    .get('/')
	    .expect(200)
	    .end((err, res) => {
	      if (err) return assert.fail(err);
	      assert.pass('Got /, test passed!');
	      assert.end();
	    });
	});

	test('get /auth', assert => {
	  request(app)
	    .get('/auth')
	    .expect(200)
	    .end((err, res) => {
	      if (err) return assert.fail(err);
	      assert.pass('Got /auth, test passed!');
	      assert.end();
	    });
	});

	test('get /search', assert => {
	  request(app)
	    .get('/search')
	    .expect(200)
	    .end((err, res) => {
	      if (err) return assert.fail(err);
	      assert.pass('Got /search, test passed!');
	      assert.end();
	    });
	});

	test('get /create', assert => {
	  request(app)
	    .get('/create')
	    .expect(200)
	    .end((err, res) => {
	      if (err) return assert.fail(err);
	      assert.pass('Got /create, test passed!');
	      assert.end();
	    });
	});

	test('get /all', assert => {
	  request(app)
	    .get('/all')
	    .expect(200)
	    .end((err, res) => {
	      if (err) return assert.fail(err);
	      assert.pass('Got /all, test passed!');
	      assert.end();
	    });
	});

	test('get /recent', assert => {
	  request(app)
	    .get('/recent')
	    .expect(200)
	    .end((err, res) => {
	      if (err) return assert.fail(err);
	      assert.pass('Got /recent, test passed!');
	      assert.end();
	    });
	});

	test('get /categories', assert => {
	  request(app)
	    .get('/categories')
	    .expect(200)
	    .end((err, res) => {
	      if (err) return assert.fail(err);
	      assert.pass('Got /categories, test passed!');
	      assert.end();
	    });
	});

	test('get /files', assert => {
	  request(app)
	    .get('/files')
	    .expect(200)
	    .end((err, res) => {
	      if (err) return assert.fail(err);
	      assert.pass('Got /files, test passed!');
	      assert.end();
	    });
	});	

	test('post /api/create', assert => {
		request(app)
			.post('/api/create')
			.send({"title": "test title", "body": "##test body heading", "category": "tests"})
			.expect(200)
			.end((err, res) => {
				if (err) return assert.fail(err);
				assert.pass('Created a new page successfully, test passed!');
				assert.end();
			})
	});

	test('get /api/all', assert => {
		request(app)
			.get('/api/all')
			.expect(200)
			.expect('Content-Type', /json/)
			.end((err, res) => {
				if (err) return assert.fail(err);
				assert.pass('Got all pages successfully, test passed!');
				assert.end();
			})
	});

	test('get /api/categories', assert => {
		request(app)
			.get('/api/categories')
			.expect(200)
			.expect('Content-Type', /json/)
			.end((err, res) => {
				if (err) return assert.fail(err);
				assert.pass('Got all categories successfully, test passed!');
				assert.end();
			})
	});

	test('get /api/recent', assert => {
		request(app)
			.get('/api/recent')
			.expect(200)
			.expect('Content-Type', /json/)
			.end((err, res) => {
				if (err) return assert.fail(err);
				assert.pass('Got all recent pages successfully, test passed!');
				assert.end();
			})
	});

	test('post /api/search', assert => {
		request(app)
			.post('/api/search')
			.send({"search": "test title"})
			.expect(200)
			.end((err, res) => {
				if (err) return assert.fail(err);
				assert.pass('Searched a page successfully, test passed!');
				assert.end();
			})
	});

	test('get /api/view/category/tests', assert => {
		request(app)
			.get('/api/view/category/tests')
			.expect(200)
			.expect('Content-Type', /json/)
			.end((err, res) => {
				if (err) return assert.fail(err);
				assert.pass('Got all pages in category tests successfully, test passed!');
				assert.end();
			})
	});

	test('get /view/category/tests', assert => {
	  request(app)
	    .get('/view/category/tests')
	    .expect(200)
	    .end((err, res) => {
	      if (err) return assert.fail(err);
	      assert.pass('Got /view/category/tests, test passed!');
	      assert.end();
	    });
	});

	test('get /api/view/page/test%20title', assert => {
		request(app)
			.get('/api/view/page/test%20title')
			.expect(200)
			.expect('Content-Type', /json/)
			.end((err, res) => {
				if (err) return assert.fail(err);
				assert.pass('Got test title successfully, test passed!');
				assert.end();
			})
	});

	test('get /view/page/test%20title', assert => {
	  request(app)
	    .get('/view/page/test%20title')
	    .expect(200)
	    .end((err, res) => {
	      if (err) return assert.fail(err);
	      assert.pass('Got /view/page/test%20title, test passed!');
	      assert.end();
	    });
	});

	test('patch /api/edit', assert => {
		request(app)
			.patch('/api/edit')
			.send({"title": "test title", "body": "##new test body heading", "category": "tests2"})
			.expect(200)
			.end((err, res) => {
				if (err) return assert.fail(err);
				assert.pass('Edited test title successfully, test passed!');
				assert.end();
			})
	});

	test('delete /api/delete/page/test%20title', assert => {
		request(app)
			.delete('/api/delete/page/test%20title')
			.expect(200)
			.end((err, res) => {
				if (err) return assert.fail(err);
				assert.pass('Deleted test title successfully, test passed!');
				assert.end();
			})
	});

	test('get /api/auth/logout', assert => {
	  request(app)
	    .get('/api/auth/logout')
	    .expect(200)
	    .end((err, res) => {
	      if (err) return assert.fail(err);
	      assert.pass('Logged out a user successfully, test passed!');
	      assert.end();
	    });
	});	

	test('post /api/auth/login', assert => {
		request(app)
			.post('/api/auth/login')
			.send({"username": "fake@faker.net", "password": "fake"})
			.expect(200)
			.end((err, res) => {
				if (err) return assert.fail(err);
				assert.pass('Logged in a user successfully, test passed!');
				assert.end();
			})
	});

	//process.exit(0);
});