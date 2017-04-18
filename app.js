require('dotenv').config({ silent: true })
const bodyParser = require('body-parser')
const express = require('express')
const ejsLayouts = require('express-ejs-layouts')
const path = require('path')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const flash = require('connect-flash')
// const morgan = require('morgan')('dev')
const passport = require('./config/passport')
const methodOverride = require('method-override')

// custom-middleware
const isLoggedIn = require('./middleware/isLoggedIn')

// routers
const userRouter = require('./routes/users_router')
const categoryRouter = require('./routes/categories_router')

const PORT = process.env.PORT || 3000
var dbURI
if (process.env.NODE_ENV === 'test') {
  dbURI = process.env.MONGO_DB_URI_TEST
} else {
  dbURI = process.env.PROD_MONGODB || process.env.MONGO_DB_URI
}
mongoose.connect(dbURI)
mongoose.Promise = global.Promise

const app = express()

// configure session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({ url: dbURI })
}))

// MIDDLEWARE Config
// app.use(morgan)
app.set('view engine', 'ejs')
app.use(ejsLayouts)
// app.use(require('morgan')('dev'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))

// initialize the passport configuration and session as middleware
app.use(passport.initialize())
app.use(passport.session())

// flash
app.use(flash())
app.use(function (req, res, next) {
  // before every route, attach the flash messages and current user to res.locals
  res.locals.alerts = req.flash()
  res.locals.currentUser = req.user
  next()
})
// MIDDLEWARE

// ROUTERS
app.get('/', function (req, res) {
  res.redirect('/users/login')
  // res.render('home', {
  //   extractScripts: true,
  //   extractStyles: true
  // })
})

app.use('/users', userRouter)
app.use(isLoggedIn)
app.use('/categories', categoryRouter)

// ROUTERS

app.listen(PORT, function () {
  console.log('express server running at ' + PORT)
})
