const express = require('express')
const app = express()
const mongoose = require('mongoose')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo').default
const methodOverride = require('method-override')
const flash = require('express-flash')
const logger = require('morgan')
const connectDB = require('./config/database')
const mainRoutes = require('./routes/main')
const songRoutes = require('./routes/songs')
const playlistRoutes = require('./routes/playlists')

// Use .env file in config folder
require('dotenv').config({ path: './config/.env' })

// Passport config
require('./config/passport')(passport)

// Connect to the Database
connectDB()

// Use EJS for views
app.set('view engine', 'ejs')

// Static Folder
app.use(express.static('public'))
app.use(express.static('img'))

// Body Parsing
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Logging
app.use(logger('dev'))

// Use forms for put and delete
app.use(methodOverride('_method'))

app.use(
    session({
        secret: 'chonky cat',
        resave: false,
        saveUninitialized: false,
    })
)

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Use flash messages for errors, info, etc
app.use(flash())

// Setup routes for which the server is listening
app.use('/', mainRoutes)
app.use('/song', songRoutes)
app.use('/playlist', playlistRoutes)

// Server running
const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})