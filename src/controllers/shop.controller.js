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
        styles: ['shop', 'products'],
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
        path: '/',
        styles: ['shop', 'products'],
      })
    } catch (err) {
      logger.error(err)
    }
  },
  getCart: (req, res, next) => {
    req.user
      .getCart()
      .then((cart) => {
        return cart
          .getProducts()
          .then((products) => {
            res.render('shop/cart', {
              path: '/cart',
              pageTitle: 'Your cart',
              styles: ['cart'],
              products: products,
            })
          })
          .catch(console.log)
      })
      .catch(console.log)
  },
  postCart: (req, res, next) => {
    const prodId = req.body.productId
    let fetchedCart
    let newQuantity = 1
    req.user
      .getCart()
      .then((cart) => {
        fetchedCart = cart
        return cart.getProducts({ where: { id: prodId } })
      })
      .then((products) => {
        let product
        if (products.length > 0) {
          product = products[0]
        }
        if (product) {
          const oldQuantity = product.cartItem.quantity
          newQuantity += oldQuantity
          return product
        }
        return Product.findByPk(prodId)
      })
      .then((product) => {
        return fetchedCart.addProduct(product, {
          through: { quantity: newQuantity },
        })
      })
      .then((cart) => {
        res.redirect('/cart')
      })
      .catch(console.log)
  },
  postCartDeleteProduct: (req, res, next) => {
    const prodId = req.body.productId
    req.user
      .getCart()
      .then((cart) => {
        return cart.getProducts({ where: { id: prodId } })
      })
      .then((products) => {
        const product = products[0]
        return product.cartItem.destroy()
      })
      .then((result) => {
        res.redirect('/cart')
      })
      .catch(console.log)
  },
  postOrder: (req, res, next) => {
    let fetchedCart
    req.user
      .getCart()
      .then((cart) => {
        fetchedCart = cart
        return cart.getProducts()
      })
      .then((products) => {
        return req.user
          .createOrder()
          .then((order) => {
            order.addProducts(
              products.map((product) => {
                product.orderItem = { quantity: product.cartItem.quantity }
                return product
              }),
            )
          })
          .then((result) => {
            return fetchedCart.setProducts(null)
          })
          .then((result) => {
            res.redirect('/orders')
          })
          .catch(console.log)
      })
      .catch(console.log)
  },
  getOrders: (req, res, next) => {
    req.user
      .getOrders({ include: [{ model: Product }] })
      .then((orders) => {
        console.log(`${orders} 🛒`)
        res.render('shop/orders', {
          path: '/orders',
          pageTitle: 'Your orders',
          styles: ['orders'],
          orders: orders,
        })
      })
      .catch(console.log)
  },
}
