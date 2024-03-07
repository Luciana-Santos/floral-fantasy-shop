const Product = require('../models/product')
const logger = require('../utils/logger')

module.exports = {
  getAddProducts: (req, res, next) => {
    res.render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      styles: ['form'],
      editing: false,
    })
  },
  postAddProduct: async (req, res, next) => {
    try {
      const userId = await req.user._id
      const { imageUrl, title, price, description } = req.body
      const product = new Product(
        imageUrl,
        title,
        price,
        description,
        null,
        userId,
      )
      await product.save()
      res.redirect('/admin/products')
    } catch (err) {
      logger.error(err)
    }
  },
  getEditProduct: async (req, res) => {
    const editMode = req.query.edit
    if (!editMode) {
      return res.redirect('/')
    }
    try {
      const prodId = req.params.productId
      const product = await Product.findById(prodId)
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
    } catch (err) {
      logger.error(err)
    }
  },
  postEditProduct: async (req, res, next) => {
    try {
      const { imageUrl, title, price, description, prodId } = req.body
      const product = new Product(imageUrl, title, price, description, prodId)
      await product.save()
      res.redirect('/admin/products')
    } catch (err) {
      logger.error(err)
    }
  },
  getProducts: async (req, res, next) => {
    try {
      const products = await Product.fetchAll()
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Shop',
        styles: ['products'],
        path: '/admin/products',
      })
    } catch (err) {
      logger.error(err)
    }
  },
  postDeleteProduct: async (req, res, next) => {
    try {
      const prodId = req.body.productId
      await Product.deleteById(prodId)
      res.redirect('/admin/products')
    } catch (err) {
      logger.error(err)
    }
  },
}
