var Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  var Diff = sequelize.define('Diff', {
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
    	category:  {
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
	});
  return Diff;
};