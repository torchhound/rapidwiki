const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    username: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
      validate: {
        len: {
          args: [1, 60],
          msg: 'Usernames must be less than 60 characters.'
        }
      }
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
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