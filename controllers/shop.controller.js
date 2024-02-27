const Product = require('../models/product')
const Cart = require('../models/cart')

module.exports = {
  getProducts: (req, res, next) => {
    Product.fetchAll((products) => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All products',
        path: '/products',
        styles: ['shop', 'products'],
      })
    })
  },
  getProduct: (req, res, next) => {
    const prodId = req.params.productId
    Product.findById(prodId, (product) => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products',
        styles: ['product-detail'],
      })
    })
  },
  getIndex: (req, res, next) => {
    Product.fetchAll((products) => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
        styles: ['shop', 'products'],
      })
    })
  },
  getCart: (req, res, next) => {
    Cart.getCart((cart) => {
      Product.fetchAll((products) => {
        const cartProducts = []
        for (let product of products) {
          const carProductData = cart.products.find(
            (prod) => prod.id === product.id,
          )
          if (carProductData) {
            cartProducts.push({ productData: product, qty: carProductData.qty })
          }
        }
        res.render('shop/cart', {
          path: '/cart',
          pageTitle: 'Your cart',
          styles: ['cart'],
          products: cartProducts,
        })
      })
    })
  },
  postCart: (req, res, next) => {
    const prodId = req.body.productId
    Product.findById(prodId, (product) => {
      Cart.addProduct(prodId, product.price)
    })
    res.redirect('/cart')
  },
  postCartDeleteProduct: (req, res, next) => {
    const prodId = req.body.productId
    Product.findById(prodId, (product) => {
      Cart.deleteProduct(prodId, product.price)
      res.redirect('/cart')
    })
  },
  getOrders: (req, res, next) => {
    res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Your orders',
      styles: [],
    })
  },
  getCheckout: (req, res, next) => {
    res.render('shop/checkout', {
      path: '/checkout',
      pageTitle: 'Checkout',
      styles: [],
    })
  },
}
