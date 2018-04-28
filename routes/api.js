var express = require('express');
var Sequelize = require('sequelize');
var showdown = require('showdown');

var router = express.Router();
var converter = new showdown.Converter();

var sequelize = new Sequelize('wikiDb', null, null, {
    dialect: "sqlite",
    storage: './wiki.sqlite',
});

sequelize.authenticate()
	.then(function(err) {
    	console.log('Database connection successful!');
  	}, function (err) {
    	console.log('Unable to connect to the database:', err);
  	});

sequelize.Page = sequelize.import('../models/Page');

sequelize.sync({ force: true })
	.then(function(data) {
    	console.log('Database synced!');
  	}, function (err) {
    	console.log('An error occurred while creating the table:', err);
  	});

router.post('/create', function(req, res, next) {
  if (Object.keys(req.body).length === 0 && req.body.constructor === Object) {
    res.status(400).send('Empty JSON');
  } else {
    sequelize.Page.create({title: req.body.title, body: req.body.body, category: req.body.category})
      .then(x => {
        res.status(200).send({"create": "Page successfully created!"});
      })
      .catch(err => {
        res.status(400).send({"create": `Database error: ${err}`});
      })
  }
});

router.get('/all', function(req, res, next) {
  sequelize.Page.all({raw: true}).then(pages => {
    if (pages === undefined || pages.length == 0) {
      res.status(200).send([{"title": "No pages in database"}]);
    } else {
      res.status(200).send(pages);
    }
  })
});

router.get('/categories', function(req, res, next) {
  sequelize.Page.all({
    raw: true,
    attributes: [
      [sequelize.fn('DISTINCT', sequelize.col('category')), 'category'],
    ]
  }).then(categories => {
    if (categories === undefined || categories.length == 0) {
      res.status(200).send([{"category": "No categories in database"}]);
    } else {
      res.status(200).send(categories);
    }
  })
});

router.get('/recent', function(req, res, next) {
  sequelize.Page.all({
    raw: true,
    limit: 50,
    order: [['timestamp', 'DESC']]
  }).then(recent => {
    if (recent === undefined || recent.length == 0) {
      res.status(200).send([{"title": "Nothing recent in database"}]);
    } else {
      res.status(200).send(recent);
    }
  })
});

router.post('/search', function(req, res, next) {
  sequelize.Page.all({
    raw: true,
    limit: 50,
    where: {
      title: {
        like: req.body.search + '%'
      }
    }
  }).then(results => {
    if (results  === undefined || results.length == 0) {
      res.status(200).send([{"title": "No results in database"}]);
    } else {
      res.status(200).send(results);
    }
  })
});

router.get('/view/category/:category', function(req, res, next) {
  sequelize.Page.all({
    raw: true,
    where: {
      category: req.params.category
    }
  }).then(constituents => {
    if (constituents === undefined || constituents.length == 0) {
      res.status(200).send([{"title": "Nothing in that category in database"}]);
    } else {
      res.status(200).send(constituents);
    }
  })
});

router.get('/view/page/:title', function(req, res, next) {
  sequelize.Page.findOne({
    raw: true,
    where: {
      title: req.params.title
    }
  }).then(page => {
    if (page === undefined || page === null) {
      res.status(200).send({"html": "<h1>No such page in database</h1>", "empty": "true"});
    } else {
      let title = '<h1>' + page.title + '</h1>';
      let html = title + '<br>' + converter.makeHtml(page.body);
      res.status(200).send({"html": html, "empty": "false","raw": page});
    }
  })
});

router.post('/edit', function(req, res, next) {
  if (Object.keys(req.body).length === 0 && req.body.constructor === Object) {
    res.status(400).send('Empty JSON');
  } else {
    sequelize.Page.findOne({
      where: {
        title: req.body.title
      }
    }).then(page => {
      if(page === undefined || page === null) {
        res.status(400).send({"edit": "Page not found"});
      } else {
        page.updateAttributes({
          body: req.body.body,
          category: req.body.category
        }).then(function() {
          res.status(200).send({"edit": "Page successfully updated!"});
        }).catch(function() {
          res.status(400).send({"edit": "Page update unsuccessful..."});
        })
      }
    })
  }
});

module.exports = router;