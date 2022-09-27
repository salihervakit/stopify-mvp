const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth')
const homeController = require('../controllers/home')
const songsController = require('../controllers/songs')
const { ensureAuth, ensureGuest } = require('../middleware/auth')

//Main Routes - simplified for now
router.get('/', ensureGuest, homeController.getIndex)
router.get('/profile', ensureAuth, songsController.getProfile)
router.get('/dashboard', ensureAuth, songsController.getDashboard)
router.get('/collection', ensureAuth, songsController.getPlaylists)

router.post('/login', authController.postLogin)
router.get('/logout', authController.logout)
router.get('/signup', authController.getSignup)
router.post('/signup', authController.postSignup)

module.exports = router
