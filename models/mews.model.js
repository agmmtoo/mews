import mongoose from 'mongoose'

const MewsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: 'Title is required'
    },
    link: {
        type: String,
        required: 'Link is required'
    }
}, { timestamps: true })

export default mongoose.model('Mews', MewsSchema)