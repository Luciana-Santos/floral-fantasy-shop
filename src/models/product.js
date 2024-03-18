const mongoose = require("mongoose")

const Schema = mongoose.Schema

const productSchema = new Schema({
  imageUrl: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
})

module.exports = mongoose.model("Product", productSchema)

// const logger = require('../utils/logger')

// const { getDb, parseIdFromHexString } = require('../config/database_off')

// class Product {
//   constructor(imageUrl, title, price, description, id, userId) {
//     this.imageUrl = imageUrl
//     this.title = title
//     this.price = price
//     this.description = description
//     this._id = id
//     this.userId = userId
//   }

//   async save() {
//     try {
//       const db = getDb()
//       let product
//       if (this._id) {
//         product = await db
//           .collection('products')
//           .updateOne({ _id: parseIdFromHexString(this._id) }, { $set: this })
//         logger.debug(product, 'product updated')
//         return product
//       }
//       product = await db.collection('products').insertOne(this)
//       logger.debug(product, 'product created')
//       return product
//     } catch (err) {
//       logger.error(err)
//     }
//   }

//   static async fetchAll() {
//     try {
//       const db = getDb()
//       const products = await db.collection('products').find().toArray()
//       return products
//     } catch (err) {
//       logger.error(err)
//     }
//   }

//   static async findById(prodId) {
//     try {
//       const db = getDb()
//       const product = await db
//         .collection('products')
//         .find({ _id: parseIdFromHexString(prodId) })
//         .next()
//       return product
//     } catch (err) {
//       logger.error(err)
//     }
//   }

//   static async deleteById(prodId) {
//     try {
//       const db = getDb()
//       await db
//         .collection('products')
//         .deleteOne({ _id: parseIdFromHexString(prodId) })
//       db.collection('users').updateMany(
//         {},
//         {
//           $pull: { 'cart.items': { _id: parseIdFromHexString(prodId) } },
//         },
//       )
//       logger.info('product deleted')
//     } catch (err) {
//       logger.error(err)
//     }
//   }
// }

// module.exports = Product
