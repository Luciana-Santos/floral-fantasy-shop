const { getDb, parseIdFromHexString } = require('../config/database')
const logger = require('../utils/logger')

class User {
  constructor(username, email, cart, id) {
    this.name = username
    this.email = email
    this.cart = cart || { items: [], total: 0 }
    this._id = id
  }

  async save() {
    try {
      const db = getDb()
      const user = await db.collection('users').inserOne(this)
      return user
    } catch (err) {
      logger.error(err)
    }
  }

  async addToCart(product) {
    try {
      const db = getDb()
      let newQuantity = 1
      let newSubtotal = 0
      const updatedCartItems = [...this.cart.items]

      const cartProductIndex = this.cart.items.findIndex(
        (cartItem) => cartItem.productId.toString() === product._id.toString(),
      )

      if (cartProductIndex >= 0) {
        newQuantity = this.cart.items[cartProductIndex].quantity + 1
        updatedCartItems[cartProductIndex].quantity = newQuantity
        newSubtotal = +product.price * newQuantity
        updatedCartItems[cartProductIndex].subtotal = newSubtotal
      } else {
        updatedCartItems.push({
          productId: product._id,
          quantity: newQuantity,
          subtotal: +product.price,
        })
      }
      const getCartTotalPrice = updatedCartItems
        .map((product) => product.subtotal)
        .reduce((prevSubtotal, currSubtotal) => prevSubtotal + currSubtotal)
      const updatedCart = {
        items: updatedCartItems,
        total: getCartTotalPrice,
      }

      return await db
        .collection('users')
        .updateOne({ _id: this._id }, { $set: { cart: updatedCart } })
    } catch (err) {
      logger.error(err)
    }
  }

  async getCart() {
    try {
      const db = getDb()
      const productIds = this.cart.items.map((item) => item.productId)
      const products = await db
        .collection('products')
        .find({ _id: { $in: productIds } })
        .toArray()
      const newProducts = products.map((prod) => {
        const prodItem = this.cart.items.find((item) => {
          return item.productId.toString() === prod._id.toString()
        })

        return {
          ...prod,
          quantity: prodItem.quantity,
          subtotal: parseFloat(prodItem.subtotal),
        }
      })
      const totalPrice = newProducts
        .map((prodPrice) => prodPrice.subtotal)
        .reduce((acc, curr) => acc + curr, 0)
      return { newProducts, totalPrice }
    } catch (err) {
      logger.error(err, 'erro ao mapear o cart')
    }
  }

  async deleteItemFromCart(productId) {
    try {
      const db = getDb()
      const updatedCartItems = this.cart.items.filter(
        (item) => item.productId.toString() !== productId.toString(),
      )
      logger.info(updatedCartItems, 'deleteItemFromCart: updatedCartItems')
      return await db
        .collection('users')
        .updateOne(
          { _id: this._id },
          { $set: { cart: { items: updatedCartItems } } },
        )
    } catch (err) {
      logger.error(err)
    }
  }

  async addOrder() {
    try {
      const db = getDb()
      const cart = await this.getCart()
      const order = {
        items: cart.newProducts,
        total: cart.totalPrice,
        user: {
          _id: this._id,
          name: this.name,
        },
      }
      await db.collection('orders').insertOne(order)
      this.cart = { items: [], totalPrice: 0 }
      await db
        .collection('users')
        .updateOne(
          { _id: this._id },
          { $set: { cart: { items: [], totalPrice: 0 } } },
        )
    } catch (err) {
      logger.error(err)
    }
  }

  async getOrders() {
    try {
      const db = getDb()
      const orders = await db
        .collection('orders')
        .find({ 'user._id': this._id })
        .toArray()
      return orders
    } catch (err) {
      logger.error(err)
    }
  }

  static async findById(userId) {
    try {
      const db = getDb()
      const user = await db
        .collection('users')
        .findOne({ _id: parseIdFromHexString(userId) })
      return user
    } catch (err) {
      logger.error(err)
    }
  }
}

module.exports = User
