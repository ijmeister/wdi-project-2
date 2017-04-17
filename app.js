const bodyParser = require('body-parser')
const express = require('express')
const ejsLayouts = require('express-ejs-layouts')
const path = require('path')
const mongoose = require('mongoose')
// const methodOverride = require('method-override')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const flash = require('connect-flash')
const morgan = require('morgan')('dev')
const passport = require('./config/passport')
require('dotenv').config({ silent: true })

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

// configure middlewares
app.use(morgan)
app.set('view engine', 'ejs')
app.use(ejsLayouts)
app.use(require('morgan')('dev'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(flash())
// initialize the passport configuration and session as middleware
app.use(passport.initialize())
app.use(passport.session())

// routers
app.get('/', function (req, res) {
  res.render('home')
})

app.use('/users', userRouter)
app.use('/categories', categoryRouter)

app.listen(PORT, function () {
  console.log('express server running at ' + PORT)
})
