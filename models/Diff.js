var Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  var Diff = sequelize.define('Diff', {
    	title: {
    		type: Sequelize.STRING
    	},
    	difference: Sequelize.JSON,
    	category: Sequelize.TEXT,
    	hash: Sequelize.TEXT,
      timestamp: Sequelize.TEXT
	});
  return Diff;
};