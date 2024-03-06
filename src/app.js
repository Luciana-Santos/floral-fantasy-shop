const path = require('./utils/path')

const express = require('express')

const adminRoutes = require('./routes/admin.route.js')
const shopRoutes = require('./routes/shop.route.js')

const errorController = require('./controllers/error.controller.js')
const appEnv = require('./config/env.js')

const mongoConnect = require('./config/database.js').mongoConnect

const app = express()

app.set('view engine', 'ejs')
app.set('views', path.pathTo('views'))

app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.pathTo('public')))

app.use('/admin', adminRoutes)
app.use(shopRoutes)

app.use(errorController.get404)

mongoConnect().then(() => app.listen(appEnv.PORT))
