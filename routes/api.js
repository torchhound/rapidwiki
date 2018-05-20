const express = require('express');
const Sequelize = require('sequelize');
const showdown = require('showdown');
const crypto = require('crypto');
const jsDiff = require('diff');
const moment = require('moment');
const multer = require('multer');
const fs = require('fs');
const del = require('del');

const fileDirectory = './views/uploads/';
const router = express.Router();
const converter = new showdown.Converter();
const storage = multer.diskStorage({
    destination: fileDirectory,
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });
const maxChars = 60;
const env = process.env.ENV || 'dev'; //dev, test, or prod
var sequelize;

if (env === 'dev' || env === 'test') {
  sequelize = new Sequelize('wikiDb', null, null, {
      dialect: "sqlite",
      storage: './wiki.sqlite',
  });
} else if (env === 'prod') {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: true
    }
  })
}

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

router.post('/create', function(req, res, next) {
  if (Object.keys(req.body).length === 0 && req.body.constructor === Object) {
    res.status(400).send('Empty JSON');
  } else {
    let title = req.body.title;
    let category = req.body.category;
    if (title.length > maxChars) {
      title = title.substr(0, maxChars);
    } 
    if (category.length > maxChars) {
      category = category.substr(0, maxChars);
    }
    title = title.replace(/[^a-z0-9\s]+/gi, '');
    category = category.replace(/[^a-z0-9\s]+/gi, '');
    sequelize.Page.create({title: title, body: req.body.body, category: category, 
      timestamp: moment().format('MMMM Do YYYY, h:mm:ss a')})
      .then(x => {
        let computedDiff = [{count: 1, added: true, value: req.body.body}];
        sequelize.Diff.create({title: title, difference: computedDiff, category: category, 
          hash: crypto.createHash('md5').update(req.body.body).digest('hex'), timestamp: moment().format('MMMM Do YYYY, h:mm:ss a'),
          user: req.session.user.username})
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
      res.status(200).send([{"title": "", "error": "No pages in database"}]);
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
      res.status(200).send([{"category": "", "error": "No categories in database"}]);
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
      res.status(200).send([{"title": "", "error": "Nothing recent in database"}]);
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
      res.status(200).send([{"title": "", "error": "No results in database"}]);
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

router.patch('/edit', function(req, res, next) {
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
          let category = req.body.category;
          if (category.length > maxChars) {
            category = category.substr(0, maxChars);
          }
          category = category.replace(/[^a-z0-9\s]+/gi, '');
          let computedDiff = jsDiff.diffChars(page.body, req.body.body);
          sequelize.Diff.create({title: req.body.title, difference: computedDiff, category: category, 
            hash: crypto.createHash('md5').update(req.body.body).digest('hex'), timestamp: moment().format('MMMM Do YYYY, h:mm:ss a'),
            user: req.session.user.username})
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

router.post('/file', upload.single('file'), function(req, res, next) {
  if (!req.file) {
    res.status(200).send({"files": "No file present...", "error": true}); 
  } else {
    res.status(200).send({"files": "Files uploaded successfully!", "error": false}); 
  }
});

router.get('/files', function(req, res, next) {
  let uploadedFiles = [];
  fs.readdirSync(fileDirectory).forEach(file => {
    uploadedFiles.push(file);
  })
  res.status(200).send({"files": uploadedFiles}); 
});

router.delete('/delete/page/:page', function(req, res, next) {
  sequelize.Page.destroy({
    where: {
      title: req.params.page
    }
  }).then(x => {
    console.log(x);
    res.status(200).send();
  })
});

router.delete('/delete/file/:file', function(req, res, next) {
  console.log('delete' + fileDirectory + req.params.file);
  del([fileDirectory + req.params.file])
  .then(x => {
    res.status(200).send();
  })
});

router.post('/auth/signup', function(req, res, next) {
  sequelize.User.create({
    username: req.body.username,
    password: req.body.password
  }).then(user => {
    req.session.user = user.dataValues;
    res.status(200).send({"signup": true});
  }).catch(error => {
    res.status(200).send({"error": error, "signup": false});
  });
});

router.post('/auth/login', function(req, res, next) {
  sequelize.User.findOne({
    username: req.body.username
  }).then(user => {
    if (user === null || user === undefined || !user.validPassword(req.body.password)) {
      res.status(200).send({"error": "Error logging you in...", "login": false});
    } else {
      req.session.user = user.dataValues;
      res.status(200).send({"login": true})
    }
  })
});

router.get('/auth/logout', function(req, res, next) {
  if (req.session.user && req.cookies.userId) {
    res.clearCookie('userId');
    res.status(200).send({"logout": true});
  } else {
    res.status(200).send({"logout": false});
  }  
});

module.exports = router;