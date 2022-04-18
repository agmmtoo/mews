import mongoose from 'mongoose'

const MewsSchema = new mongoose.Schema({
    submitter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: 'No submitter?'
    },
    title: String,
    link: String,
    body: String,
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mews'
    },
    ancestors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mews'
    }],
    children: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mews'
    }],
    boosters: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    points: {
        type: Number,
        default: 0
    }
}, { timestamps: true })

export default mongoose.model('Mews', MewsSchema)