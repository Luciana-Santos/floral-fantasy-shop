const fs = require('fs')
const path = require('../utils/path')
const crypto = require('crypto')

const Cart = require('./cart')

const storage = path.pathTo('data', 'products.json')

const getProductsFromFile = (cb) => {
  fs.readFile(storage, (err, fileContent) => {
    if (err) {
      cb([])
    } else {
      cb(JSON.parse(fileContent))
    }
  })
}

module.exports = class Product {
  constructor(id, imageUrl, title, price, description) {
    this.id = id
    this.imageUrl = imageUrl
    this.title = title
    this.price = price
    this.description = description
  }

  save() {
    getProductsFromFile((products) => {
      if (this.id) {
        const existingProductIndex = products.findIndex(
          (prod) => prod.id === this.id,
        )
        const updatedProducts = [...products]
        updatedProducts[existingProductIndex] = this
        fs.writeFile(storage, JSON.stringify(updatedProducts), (err) => {
          console.log(`error: ${err}`)
        })
      } else {
        this.id = crypto.randomBytes(4).toString('hex')
        products.push(this)
        fs.writeFile(storage, JSON.stringify(products), (err) => {
          console.log(`error: ${err}`)
        })
      }
    })
  }

  static deleteById(id) {
    getProductsFromFile((products) => {
      const product = products.find((prod) => prod.id === id)
      const updatedProducts = products.filter((prod) => prod.id !== id)
      fs.writeFile(storage, JSON.stringify(updatedProducts), (err) => {
        if (!err) {
          Cart.deleteProduct(id, product.price)
        }
      })
    })
  }

  static fetchAll(cb) {
    getProductsFromFile(cb)
  }

  static findById(id, cb) {
    getProductsFromFile((products) => {
      const product = products.find((p) => p.id === id)
      cb(product)
    })
  }
}
