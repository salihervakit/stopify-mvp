const mongoose = require('mongoose')
const cloudinary = require('../middleware/cloudinary')
const moment = require('moment')
const Playlist = require('../models/Playlist')
const Song = require('../models/Song')

module.exports = {
  createPlaylist: async (req, res) => {
    try {
      await Playlist.create({
        title: req.body.title,
        songs: req.body.songs,
        user: req.user.id,
      })
      
      console.log('Playlist has been added!')
      res.redirect('/dashboard')
    } catch (err) {
      console.log(err)
      res.render('error/500')
    }
  },
  getPlaylist: async (req, res) => {
    try {
			const playlist = await Playlist.find({ _id: req.params.id })
      const playlists = await Playlist.find({ user: req.user.id })

			const songIdArray = playlist[0].songs

      const songs = await Song.find({
        _id: { $in: songIdArray },
			}, function (err, result) {
        if (err) console.log(err)
        return result
      }).clone().catch(function(err){console.log(err)})


      res.render("playlist.ejs", { playlists: playlists, playlist: playlist, songs: songs, user: req.user, moment: moment });
    } catch (err) {
      console.log(err);
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
  deletePlaylist: async (req, res) => {
    try {
      const playlistId = mongoose.Types.ObjectId(req.params.id)
      // Find playlist by id
      const playlist = (await Playlist.findById({ _id: playlistId })).songs
      
      const songs = await Song.find({ _id: { $in: playlist } })

      let songIds = []

      // Delete audios from cloudinary
      for (let i = 0; i < songs.length; i++) {
        await cloudinary.uploader.destroy(songs[i].cloudinaryId, { resource_type: 'video' })
        songIds.push(songs[i]._id)
      }
      // Delete playlist from db
      await Playlist.findOneAndDelete({ _id: playlistId },
        function(err, result) {
          if (err) console.log(err)
          else console.log(result)
        }
      )

      // console.log(req.params)
      // console.log(songs)
      // console.log(songIds)
      // Delete the songs in that playlist
      await Song.remove({ _id: { $in: songIds }},
        function(err, result) {
          if (err) console.log(err)
          else console.log(result)
        }
      )
      
      console.log('Song is deleted')
      res.redirect('/dashboard')
    } catch (err) {
      res.redirect('/dashboard')
    }
  },
}
