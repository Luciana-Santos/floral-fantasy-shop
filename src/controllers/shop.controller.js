const Product = require('../models/product')
const logger = require('../utils/logger')

module.exports = {
  getProducts: async (req, res, next) => {
    try {
      const products = await Product.fetchAll()
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All products',
        path: '/products',
        styles: ['products'],
      })
    } catch (err) {
      logger.error(err)
    }
  },
  getProduct: async (req, res, next) => {
    try {
      const prodId = req.params.productId
      const product = await Product.findById(prodId)
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products',
        styles: ['product-detail'],
      })
    } catch (err) {
      logger.error(err)
    }
  },
  getIndex: async (req, res, next) => {
    try {
      const products = await Product.fetchAll()
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/shop',
        styles: ['products'],
      })
    } catch (err) {
      logger.error(err)
    }
  },
  getCart: async (req, res, next) => {
    try {
      const products = await req.user.getCart()
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your cart',
        styles: ['cart'],
        products: products,
      })
    } catch (err) {
      logger.error(err, 'erro no get do cart')
    }
  },
  postCart: async (req, res, next) => {
    try {
      const { productId } = req.body
      const product = await Product.findById(productId)
      const cartItem = await req.user.addToCart(product)
      res.redirect('/cart')
      return cartItem
    } catch (err) {
      logger.error(err)
    }
  },
  postCartDeleteProduct: async (req, res, next) => {
    try {
      const prodId = req.body.productId
      const products = await req.user.deleteItemFromCart(prodId)
      logger.info(products, 'deleted item')
      res.redirect('/cart')
      return products
    } catch (err) {
      logger.error(err)
    }
  },
  postOrder: async (req, res, next) => {
    try {
      await req.user.addOrder()
      res.redirect('/orders')
    } catch (err) {
      logger.error(err, 'postOrder')
    }
  },
  getOrders: async (req, res, next) => {
    try {
      const orders = await req.user.getOrders()
      logger.info(orders, 'getorders: orders')
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your orders',
        styles: ['orders'],
        orders: orders,
      })
    } catch (err) {
      logger.error(err)
    }
  },
}
