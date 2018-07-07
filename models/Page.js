const Sequelize = require('sequelize');

/**
*@class Page
*@classdesc This class represents a page on the wiki.
*@constructor
*@param {string} title - A unique string for the title of the page.
*@param {string} body - A markdown string containing the body of the page.
*@param {string} category - A string representing the category of each page.
*@param {string} timestamp - A string representing the time the page was created.
*/
module.exports = function(sequelize, DataTypes) {
  let Page = sequelize.define('Page', {
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