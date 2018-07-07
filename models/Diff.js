const Sequelize = require('sequelize')

/**
*@class Diff
*@classdesc This class represents a page version on the wiki.
*@constructor
*@param {string} title - A unique string for the title of the page.
*@param {JSON} difference - A JSON representation of the computed difference between the old and new versions of the body.
*@param {string} category - A string representing the category of each page.
*@param {string} hash - A string hash of the body.
*@param {string} timestamp - A string representing the time the page was created.
*@param {string} user - The user who made the change.
*/
module.exports = function (sequelize, DataTypes) {
  let Diff = sequelize.define('Diff', {
    title: {
      type: Sequelize.STRING,
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
    difference: Sequelize.JSON,
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
    hash: Sequelize.TEXT,
    timestamp: Sequelize.TEXT,
    user: Sequelize.STRING
  })
  return Diff
}
