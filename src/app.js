const path = require('./utils/path')

const express = require('express')

const adminRoutes = require('./routes/admin.route.js')
const shopRoutes = require('./routes/shop.route.js')

const errorController = require('./controllers/error.controller.js')
const appEnv = require('./config/env.js')

const mongoConnect = require('./config/database.js').mongoConnect
const User = require('./models/user.js')
const logger = require('./utils/logger.js')

const app = express()

app.use(async (req, res, next) => {
  try {
    const user = await User.findById('65e8ccaaa31399350e3fa751')
    req.user = new User(user.name, user.email, user.cart, user._id)
  } catch (err) {
    logger.error(err)
  }
  next()
})

app.set('view engine', 'ejs')
app.set('views', path.pathTo('views'))

app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.pathTo('public')))

app.use('/admin', adminRoutes)
app.use(shopRoutes)

app.use(errorController.get404)

mongoConnect().then(() => app.listen(appEnv.PORT))
