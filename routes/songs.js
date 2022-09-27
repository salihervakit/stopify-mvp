const express = require('express')
const router = express.Router()
const multer = require('../middleware/multer')
const songsController = require('../controllers/songs')
const { ensureAuth, ensureGuest } = require('../middleware/auth')

//Post Routes - simplified for now
// router.get('/:id', ensureAuth, songsController.getSong)

router.post('/createSong', multer.single('file'), songsController.createSong)

// router.put('/likePost/:id', postsController.likePost)

router.delete('/deleteSong/:id', songsController.deleteSong)

module.exports = router
