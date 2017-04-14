const bodyParser = require('body-parser')
const express = require('express')
const ejsLayouts = require('express-ejs-layouts')
const path = require('path')
const mongoose = require('mongoose')
// const methodOverride = require('method-override')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
// const flash = require('connect-flash')
require('dotenv').config()

const PORT = process.env.PORT || 3000
var dbUrl
if (process.env.NODE_ENV === 'test') {
  dbUrl = process.env.MONGO_DB_URI_TEST
} else {
  dbUrl = process.env.PROD_MONGODB || process.env.MONGO_DB_URI
}
mongoose.connect(dbUrl)
mongoose.Promise = global.Promise

const app = express()

// configure session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({ url: dbUrl })
}))

// configure middlewares
app.set('view engine', 'ejs')
app.use(ejsLayouts)
app.use(require('morgan')('dev'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', function (req, res) {
  res.render('home')
})

app.listen(PORT, function () {
  console.log('express server running at ' + PORT)
})
