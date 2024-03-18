const Product = require("../models/product")
const Order = require("../models/order")
const logger = require("../utils/logger")

module.exports = {
  getProducts: async (req, res) => {
    try {
      const products = await Product.find()
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All products",
        path: "/products",
        styles: ["products"],
      })
    } catch (err) {
      logger.error(err)
    }
  },
  getProduct: async (req, res) => {
    try {
      const prodId = req.params.productId
      const product = await Product.findById(prodId)
      res.render("shop/product-detail", {
        product: product,
        pageTitle: product.title,
        path: "/products",
        styles: ["product-detail"],
      })
    } catch (err) {
      logger.error(err)
    }
  },
  getIndex: async (req, res) => {
    try {
      const products = await Product.find()
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/shop",
        styles: ["products"],
      })
    } catch (err) {
      logger.error(err)
    }
  },
  getCart: async (req, res) => {
    try {
      const user = await req.user.populate("cart.items.productId")
      const cart = await user.cart
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your cart",
        styles: ["cart"],
        cart: cart,
      })
    } catch (err) {
      logger.error(err, "erro no get do cart")
    }
  },
  postCart: async (req, res) => {
    try {
      const { productId } = req.body
      const product = await Product.findById(productId)
      const cartItem = await req.user.addToCart(product)
      res.redirect("/cart")
      return cartItem
    } catch (err) {
      logger.error(err)
    }
  },
  postCartDeleteProduct: async (req, res) => {
    try {
      const prodId = req.body.productId
      const products = await req.user.removeFromCart(prodId)
      logger.info(products, "deleted item")
      res.redirect("/cart")
      return products
    } catch (err) {
      logger.error(err)
    }
  },
  postOrder: async (req, res) => {
    try {
      const user = await req.user.populate("cart.items.productId")
      const products = await user.cart.items.map((item) => {
        return {
          quantity: item.quantity,
          product: { ...item.productId._doc },
          subtotal: item.subtotal,
        }
      })
      const order = new Order({
        user: {
          name: req.user.name,
          userId: req.user,
        },
        products: products,
      })
      order.save()
      await req.user.clearCart()
      res.redirect("/orders")
    } catch (err) {
      logger.error(err, "postOrder")
    }
  },
  getOrders: async (req, res) => {
    try {
      const orders = Order.find({ "user.userId": req.user._id })
      logger.info(orders, "getorders: orders")
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your orders",
        styles: ["orders"],
        orders: orders,
      })
    } catch (err) {
      logger.error(err)
    }
  },
}
