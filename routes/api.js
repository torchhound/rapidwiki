var express = require('express');
var Sequelize = require('sequelize');
var showdown = require('showdown');
var crypto = require('crypto');
var jsDiff = require('diff');
var moment = require('moment');

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
sequelize.Diff = sequelize.import('../models/Diff');

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
    sequelize.Page.create({title: req.body.title, body: req.body.body, category: req.body.category, 
      timestamp: moment().format('MMMM Do YYYY, h:mm:ss a')})
      .then(x => {
        let computedDiff = [{count: 1, added: true, value: req.body.body}];
        sequelize.Diff.create({title: req.body.title, difference: computedDiff, category: req.body.category, 
          hash: crypto.createHash('md5').update(req.body.body).digest('hex'), timestamp: moment().format('MMMM Do YYYY, h:mm:ss a')})
        .then(y => {
          res.status(200).send({"create": "Page successfully created!"});
        })
        .catch(err => {
          res.status(200).send({"create": "", "error": `Database diff error: ${err}`});
        })
      })
      .catch(err => {
        res.status(200).send({"create": "", "error": `Database page error: ${err}`});
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
  return Promise.all([
    sequelize.Page.findOne({
      raw: true,
      where: {
        title: req.params.title
      }
    }),
    sequelize.Diff.findAll({
      raw: true,
      where: {
        title: req.params.title
      }
    })
  ])
  .then( ([page, diff]) => {
    if (page === undefined || page === null || diff === undefined || diff=== null) {
      res.status(200).send({"html": "<h1>No such page in database</h1>", "empty": "true"});
    } else {
      let title = '<h1>' + page.title + '</h1>';
      let html = title + '<br>' + converter.makeHtml(page.body);
      diff.forEach(function(history) {
        let outer = JSON.parse(history.difference);
        let diffHtml = "";
        outer.forEach(function(part) {
          let color = part.added ? 'green' : part.removed ? 'red' : 'grey';
          let span = "<span style='color:" + color + "'>" + part.value + "</span>";
          diffHtml += span;
        });
        history.difference = diffHtml;
      });
      res.status(200).send({"html": html, "empty": "false","raw": page, "diff": diff});
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
        if (page.body === req.body.body) {
          res.status(400).send({"edit": "Page update unsuccessful..."});
        } else {
          let computedDiff = jsDiff.diffChars(page.body, req.body.body);
          sequelize.Diff.create({title: req.body.title, difference: computedDiff, category: req.body.category, 
            hash: crypto.createHash('md5').update(req.body.body).digest('hex'), timestamp: moment().format('MMMM Do YYYY, h:mm:ss a')})
          .then(x => {
            page.updateAttributes({
              body: req.body.body,
              category: req.body.category
            }).then(function() {
              res.status(200).send({"edit": "Page successfully updated!"});
            }).catch(function() {
              res.status(400).send({"edit": "Page update unsuccessful..."});
            })
          })
        }
      }
    })
  }
});

module.exports = router;