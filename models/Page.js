var Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  var Page = sequelize.define('Page', {
    title: {
      type: Sequelize.STRING,
      unique: true,
      validate: {
        is: {
          args: /^[a-z0-9\s]+/gi,
          msg: 'Titles may only contain alphanumeric characters and white space.'
        },
        len: {
          args: [1, 60],
          msg: 'Titles must be less than 60 characters.'
        }
      }
    },
    body: Sequelize.TEXT,
    category: {
      type: Sequelize.STRING,
      validate: {
        is: {
          args: /^[a-z0-9\s]+/gi,
          msg: 'Categories may only contain alphanumeric characters and white space.'
        },
        len: {
          args: [1, 60],
          msg: 'Categories must be less than 60 characters.'
        }
      }
    },
    timestamp: Sequelize.TEXT
  });
  return Page;
};