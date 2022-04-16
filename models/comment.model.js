import mongoose from 'mongoose'

const CommentSchema = new mongoose.Schema({
    submitter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: 'No submitter?'
    },
    body: {
        type: String,
        required: 'Comment body is required'
    },
    mews: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mews',
        required: 'No mews?'
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    },
    ancestors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    children: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }]
}, { timestamps: true })

export default mongoose.model('Comment', CommentSchema)