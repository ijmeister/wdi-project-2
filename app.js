// const bodyParser = require('body-parser')
const express = require('express')
const ejsLayouts = require('express-ejs-layouts')

var app = express()
var port = process.env.PORT || 3000

app.set('view engine', 'ejs')
app.use(ejsLayouts)

app.get('/', function (req, res) {
  res.render('home')
})

app.listen(port, function () {
  console.log('express server running at ' + port)
})
