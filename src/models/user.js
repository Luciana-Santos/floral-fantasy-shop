const mongoose = require("mongoose")
const logger = require("../utils/logger")

const Schema = mongoose.Schema

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
        subtotal: { type: Number, required: true },
      },
    ],
    total: { type: Number, required: true },
  },
})

userSchema.methods.addToCart = async function (product) {
  try {
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

    this.cart = updatedCart
    return this.save()
  } catch (err) {
    logger.error(err)
  }
}

userSchema.methods.removeFromCart = async function (productId) {
  try {
    const updatedCartItems = this.cart.items.filter((item) => {
      return item.productId.toString() !== productId.toString()
    })
    this.cart.items = updatedCartItems
    return this.save()
  } catch (err) {
    logger.error(err)
  }
}

userSchema.methods.clearCart = async function () {
  try {
    this.cart = { items: [], total: 0 }
    return this.save()
  } catch (err) {
    logger.error(err)
  }
}

module.exports = mongoose.model("User", userSchema)
