const Sequelize = require('sequelize')

const sequelize = require('../utils/database')

const User = sequelize.define('user', {
  id: {
    type: Sequelize.DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: Sequelize.DataTypes.STRING,
  email: Sequelize.DataTypes.STRING,
})

module.exports = User
