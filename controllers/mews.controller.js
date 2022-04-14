import Mews from '../models/mews.model.js'

const list = async (req, res) => {
    try {
        const mewslist = await Mews.find()
            // sort by latest added
            .sort({ createdAt: -1 })
            // exclude updatedAt and versin fields
            .select('-updatedAt -__v')
            .populate('submitter', '_id username')
        const count = await Mews.count()
        return res.status(200).json({ mewslist, count })
    } catch (error) {
        return res.status(400).json(error)
    }
}

const create = async (req, res) => {
    try {
        // only 'title' and 'link' fields are requested here
        const { title, link } = req.body
        // POST to mews required sign in, express-js' auth field is present
        const submitter = req.auth._id
        const newmews = new Mews({ title, link, submitter })
        await newmews.save()
        return res.status(201).json(newmews)
    } catch (error) {
        return res.status(400).json(error)
    }
}

// following controller is called on routes with :id param
const mewsById = async (req, res, next, id) => {
    try {
        // get id from route param, router.param
        const mews = await Mews.findById(id).select('-__v')
        // can't find
        if (!mews) return res.status(404).json({ error: `Unable to load Mews with id ${id}` })
        // attach to req
        req.mews = mews
        // proceed further
        next()
    } catch (error) {
        return res.status(400).json({ message: `Mews with id ${id} dostn't exist`, error })
    }
}

const read = async (req, res) => {
    try {
        // mews with requested id is attached
        // to req obj by router param method: mewsById
        const mews = req.mews
        return res.status(200).json(mews)
    } catch (error) {
        // db error
        return res.status(400).json(error)
    }
}

const update = async (req, res) => {
    try {
        const { title, link } = req.body
        // const mews = { ...req.mews, title: title, link: link }
        // error if destruct with es6
        const updatedmews = req.mews
        updatedmews.title = title
        updatedmews.link = link
        await updatedmews.save()
        return res.status(202).json({ message: 'Successfully updated', updatedmews })
    } catch (error) {
        return res.status(400).json(error)
    }
}

const destroy = async (req, res) => {
    try {
        const mews = req.mews
        await mews.remove()
        return res.status(200).json({ message: 'Mews deleted successfully' })
    } catch (error) {
        return res.status(400).json({ message: 'Error deleting Mews', error })
    }
}

const requiredOwnership = async (req, res, next) => {
    // requiredSignin --> req.auth._id
    // mewsById --> req.mews
    if (req.auth._id != req.mews.submitter) return res.status(401).json({ message: `You don't own this Mews` })
    next()
}

export default { list, create, mewsById, read, update, destroy, requiredOwnership }
