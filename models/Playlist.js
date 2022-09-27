const mongoose = require('mongoose')
const { Schema } = mongoose

const PlaylistSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    songs: [
        { 
            // title: {
            //     type: String,
            //     required: true,
            // },
            // songUrl: {
            //     type: String,
            //     required: true,
            // },
            // cloudinaryId: {
            //     type: String,
            //     required: true,
            // },
            // user: {
            //     type: mongoose.Schema.Types.ObjectId,
            //     ref: 'User',
            // },
            // addedAt: {
            //     type: Date,
            //     default: Date.now,
            // }
            _id: {
                type: mongoose.Schema.Types.ObjectId
            }
        }
    ],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
})

module.exports = mongoose.model('Playlist', PlaylistSchema)