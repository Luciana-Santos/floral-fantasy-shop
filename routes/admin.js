const express = require('express')

const router = express.Router()

const adminController = require('../controllers/admin')

router.get('/add-product', adminController.getAddProducts)

router.get('/products', adminController.getProducts)

router.post('/add-product', adminController.postAddProduct)

router.get('/edit-product/:productId', adminController.getEditProduct)

module.exports = router
