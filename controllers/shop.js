const Product = require('../models/product')

module.exports = {
  getProducts: (req, res, next) => {
    Product.fetchAll((products) => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All products',
        path: '/products',
      })
    })
  },
  getIndex: (req, res, next) => {
    Product.fetchAll((products) => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
      })
    })
  },
  getCart: (req, res, next) => {
    res.render('shop/cart', {
      path: '/cart',
      pageTitle: 'Your cart',
    })
  },
  getOrders: (req, res, next) => {
    res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Your orders',
    })
  },
  getCheckout: (req, res, next) => {
    res.render('shop/checkout', {
      path: '/checkout',
      pageTitle: 'Checkout',
    })
  },
}
