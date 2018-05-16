const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
  	username: {
  		type: Sequelize.STRING,
  		unique: true,
      allowNull:false,
      validate: {
        is: /^[a-z0-9\s]+/gi
      }
  	},
  	password: {
      type: Sequelize.STRING,
      allowNull:false
    } 
  });

  User.addHook('beforeCreate', (user) => {
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(user.password, salt);
  });

  User.prototype.validPassword = function(password) {
     return bcrypt.compareSync(password, this.password);
  }
  
  return User;
};