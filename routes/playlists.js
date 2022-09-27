const express = require('express')
const router = express.Router()
const playlistsController = require('../controllers/playlists')
const { ensureAuth, ensureGuest } = require('../middleware/auth')

//Post Routes - simplified for now
router.get('/:id', ensureAuth, playlistsController.getPlaylist)

router.post('/createPlaylist', playlistsController.createPlaylist)

// router.put('/likePost/:id', postsController.likePost)

router.delete('/deletePlaylist/:id', playlistsController.deletePlaylist)

module.exports = router
