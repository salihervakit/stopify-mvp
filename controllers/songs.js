const mongoose = require('mongoose')
const cloudinary = require('../middleware/cloudinary')
const Song = require('../models/Song')
const Playlist = require('../models/Playlist')

module.exports = {
  getProfile: async (req, res) => {
    try {
      const songs = await Song.find({ user: req.user.id })
      res.render('profile.ejs', { songs: songs, user: req.user })
    } catch (err) {
      console.log(err)
      res.render('error/500')
    }
  },
  getDashboard: async (req, res) => {
    try {
      const songs = await Song.find({ user: req.user.id })
      const playlists = await Playlist.find({ user: req.user.id })
      res.render('dashboard.ejs', { songs: songs, playlists: playlists, user: req.user })
    } catch (err) {
      console.log(err)
      res.render('error/500')
    }
  },
  getPlaylists: async (req, res) => {
    try {
      const songs = await Song.find({ user: req.user.id })
      const playlists = await Playlist.find({ user: req.user.id })
      res.render('collection.ejs', { songs: songs, playlists: playlists, user: req.user })
    } catch (err) {
      console.log(err)
      res.render('error/500')
    }
  },
  // getSong: async (req, res) => {
  //   try {
  //     const song = await Song.findById(req.params.id)
  //     res.render('post.ejs', { post: post, user: req.user })
  //   } catch (err) {
  //     console.log(err)
  //   }
  // },
  createSong: async (req, res) => {
    try {
      // Upload audio to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {resource_type: 'video' })

      const playlistId = mongoose.Types.ObjectId(req.body.playlist)
      const songId = await Song.create({
        title: req.body.title,
        songUrl: result.secure_url,
        cloudinaryId: result.public_id,
        placedAt: playlistId,
        user: req.user.id,
      })

      const song = { _id: songId, }

      Playlist.findOneAndUpdate(
        { _id: playlistId },
        { $push: { songs: song } },
        function (err, result) {
          if (err) console.log(err)
          else console.log(result)
        }
      )

      console.log('Song has been added!')
      res.redirect('/dashboard')
    } catch (err) {
      console.log(err)
      res.render('error/500')
    }
  },
  // likePost: async (req, res) => {
  //   try {
  //     await Post.findOneAndUpdate(
  //       { _id: req.params.id },
  //       {
  //         $inc: { likes: 1 },
  //       }
  //     )
  //     console.log('Likes +1')
  //     res.redirect(`/post/${req.params.id}`)
  //   } catch (err) {
  //     console.log(err)
  //   }
  // },
  deleteSong: async (req, res) => {
    try {
      // Find song by id
      const songId = mongoose.Types.ObjectId(req.params.id)
      const song = await Song.findById({ _id: songId })
      const songObjId = { _id: song }

      // Delete audio from cloudinary
      await cloudinary.uploader.destroy(song.cloudinaryId, { resource_type: 'video' })
      
      // Remove song id from playlist
      const playlistId = mongoose.Types.ObjectId(song.placedAt)
      await Playlist.findOneAndUpdate(
        { _id: playlistId },
        { $pull: { songs: songObjId } },
      )
      // Delete song from playlist
      await Song.deleteOne(
        { _id: songId }
      )

      console.log('Song is deleted')
      res.redirect('/dashboard')
    } catch (err) {
      res.redirect('/dashboard')
    }
  },
}
