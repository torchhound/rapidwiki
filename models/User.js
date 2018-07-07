const Sequelize = require('sequelize')
const bcrypt = require('bcrypt')

/**
 *@class User
 *@classdesc This class represents a user in our application.
 *@constructor
 *@param {string} username - A unique string identifier for each user.
 *@param {string} password - A string for securely logging in a user.
 */
module.exports = function(sequelize, DataTypes) {
  let User = sequelize.define('User', {
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
  })

  User.addHook('beforeCreate', (user) => {
    const salt = bcrypt.genSaltSync()
    user.password = bcrypt.hashSync(user.password, salt)
  })

  User.prototype.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password)
  }

  return User
}