const Product = require('../models/product')

module.exports = {
  getAddProducts: (req, res) => {
    res.render('admin/add-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      styles: ['form'],
    })
  },
  postAddProduct: (req, res) => {
    const imageUrl = req.body.imageUrl
    const title = req.body.title
    const price = req.body.price
    const product = new Product(imageUrl, title, price)
    product.save()
    res.redirect('/')
  },
  getProducts: (req, res, next) => {
    const products = Product.fetchAll()
    res.render('shop', {
      prods: products,
      pageTitle: 'Shop',
      styles: ['shop', 'products'],
      path: '/shop',
    })
  },
}
