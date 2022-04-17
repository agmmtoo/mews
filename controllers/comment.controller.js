import Comment from '../models/comment.model.js'

// GET
const list = async (req, res) => {
    try {
        // get queries from req
        const { mews, sort, order } = req.query
        // filter requested Mews' comments
        // sort by query keys and createdAt
        const commentlist = await Comment.find({ mews })
            .select('-updatedAt -__v')
            .sort({ createdAt: 'asc', [sort]: order })
            .populate('submitter', '_id username')
        // filter direct comments only
        return res.status(200).json(commentlist.filter(c => !c.parent))
    } catch (error) {
        return res.status(400).json({ message: 'Couldn\'t retrieve comment list', error })
    }
}

// POST
const create = async (req, res) => {
    try {
        // user id from express-js contoller middleware
        const submitter = req.auth._id
        // submitter here takes submitter's "_id"
        // parent is supposed to be "_id" too
        // note: "_id" is converted to related when populate obj by mongoose, i guess
        const { body, mews, parent } = req.body
        const comment = await new Comment({ submitter, body, mews, parent })
        if (parent) {
            // remove from parent's children array
            const parentComment = await Comment.findByIdAndUpdate(parent, { $push: { children: comment } }, { new: true, timestamps: false })
            // comment's ancestor is same as parent's, plus parent's parent
            if (parentComment.parent) {
                // [great-great-grand, great-grand, grand]
                comment.ancestors = parentComment.ancestors
                comment.ancestors.push(parentComment.parent)
            }
        }
        await comment.save()
        return res.status(201).json({ message: 'Commented successfully', comment })
    } catch (error) {
        return res.status(400).json({ message: `Faild to create comment`, error })
    }
}

// controller is called on comment.router with :commentId param
const commentById = async (req, res, next, id) => {
    try {
        const comment = await Comment.findById(id)
            .populate('submitter', '_id username')
            .select('-__v')
        // returning 404 when comment is empty is WRONG, let client handle it
        // if (!comment) return res.status(404).json({ message: `Comment ${id} is empty` })
        // attach to req obj
        req.comment = comment
        next()
    } catch (error) {
        return res.status(400).json({ message: `Comment ${id} dostn't exist`, error })
    }
}

const read = async (req, res) => {
    try {
        // remember, comment with specified id is attached to req obj by router
        const comment = req.comment
        return res.status(200).json(comment)
    } catch (error) {
        return res.status(400).json({ message: 'Error retrieving comment from req obj', error })
    }
}

const update = async (req, res) => {
    try {
        const comment = req.comment
        // accept comment "body" from req.body
        const { body } = req.body
        comment.body = body
        await comment.save()
        return res.status(202).json({ mewssage: 'Successfully updated', comment })
    } catch (error) {
        return res.status(400).json({ message: 'Error updating comment from req obj', error })
    }
}

const destroy = async (req, res) => {
    try {
        const comment = req.comment
        if (comment.parent) {
            // error if pull "comment" and not "comment._id"
            await Comment.findByIdAndUpdate(comment.parent, { $pull: { children: comment._id } }, { timestamps: false })
        }
        await comment.remove()
        return res.status(200).json({ message: 'Comment deleted' })
    } catch (error) {
        return res.status(400).json({ message: 'Error deleting comment', error })
    }
}

const requiredOwnership = async (req, res, next) => {
    // requiredSignin --> req.auth._id
    // commentById --> req.comment
    if (req.auth._id != req.comment.submitter._id) return res.status(401).json({ message: `You don't own this comment` })
    next()
}

export default { list, create, commentById, read, update, destroy, requiredOwnership }
