const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const notesRouter = require('./controllers/notes')
const usersRouter = require('./controllers/users')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

//The responsibility of establishing the connection to the database has been given
// to the app.js module
mongoose.set('strictQuery', false)

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(middleware.requestLogger)

//The app.js file that creates the actual application takes the router into use
app.use('/api/notes', notesRouter)
app.use('/api/users', usersRouter)


app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app


/*

The file takes different middleware into use, and one of these is the notesRouter
that is attached to the /api/notes route.

The router we defined earlier is used if the URL of the request starts
with /api/notes. For this reason, the notesRouter object must only define
the relative parts of the routes, i.e. the empty path / or just the
parameter /:id.
*/