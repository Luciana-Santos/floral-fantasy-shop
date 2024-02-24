const Product = require('../models/product')

module.exports = {
  getAddProducts: (req, res, next) => {
    res.render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      styles: ['form'],
      editing: false,
    })
  },
  postAddProduct: (req, res) => {
    const imageUrl = req.body.imageUrl
    const title = req.body.title
    const price = req.body.price
    const description = req.body.description
    const product = new Product(imageUrl, title, price, description)
    product.save()
    res.redirect('/')
  },
  getEditProduct: (req, res) => {
    const editMode = req.query.edit
    if (!editMode) {
      return res.redirect('/')
    }
    const prodId = req.params.productId
    Product.findById(prodId, (product) => {
      if (!product) {
        return res.redirect('/')
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        styles: ['form'],
        editing: editMode,
        product: product,
      })
    })
  },
  getProducts: (req, res, next) => {
    Product.fetchAll((products) => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Shop',
        styles: ['shop', 'products'],
        path: '/shop',
      })
    })
  },
}
