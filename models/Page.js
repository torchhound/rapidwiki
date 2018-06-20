var Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  var Page = sequelize.define('Page', {
    title: {
      type: Sequelize.STRING,
      unique: true,
      validate: {
        is: /^[a-z0-9\s]+/gi
      }
    },
    body: Sequelize.TEXT,
    category: Sequelize.TEXT,
    timestamp: Sequelize.TEXT
  });
  return Page;
};