const fs = require('fs')
const path = require('../utils/path')

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
        this.id = String(Math.random() * 1000)
        products.push(this)
        fs.writeFile(storage, JSON.stringify(products), (err) => {
          console.log(`error: ${err}`)
        })
      }
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
