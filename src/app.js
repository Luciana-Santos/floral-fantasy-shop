const path = require("./utils/path")

const express = require("express")
const mongoose = require("mongoose")

const adminRoutes = require("./routes/admin.route.js")
const shopRoutes = require("./routes/shop.route.js")

const errorController = require("./controllers/error.controller.js")
const appEnv = require("./config/env.js")

// const mongoConnect = require('./config/database_off.js').mongoConnect
const User = require("./models/user.js")
const logger = require("./utils/logger.js")

const app = express()

app.use(async (req, res, next) => {
  try {
    const user = await User.findById("65f62c47f0510e029a18f0b8")
    req.user = user
  } catch (err) {
    logger.error(err)
  }
  next()
})

app.set("view engine", "ejs")
app.set("views", path.pathTo("views"))

app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.pathTo("public")))

app.use("/admin", adminRoutes)
app.use(shopRoutes)

app.use(errorController.get404)

mongoose
  .connect(appEnv.MONGO_URI)
  .then(() => {
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          name: "Kong",
          email: "kingkong@email.com",
          cart: {
            items: [],
            total: 0,
          },
        })
        user.save()
      }
    })
    logger.info("mongo connection success")
    app.listen(3000)
  })
  .catch((err) => logger.error(err))
