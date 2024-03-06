const Sequelize = require('sequelize')
const sequelize = require('../utils/database')

const CartItem = sequelize.define('cartItem', {
  id: {
    type: Sequelize.DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  quantity: Sequelize.DataTypes.INTEGER,
})

module.exports = CartItem
