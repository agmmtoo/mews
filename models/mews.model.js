import mongoose from 'mongoose'

const MewsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: 'Title is required'
    },
    link: {
        type: String,
        required: 'Link is required'
    },
    submitter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: 'No submitter?'
    }
}, { timestamps: true })

export default mongoose.model('Mews', MewsSchema)