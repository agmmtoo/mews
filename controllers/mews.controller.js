import Mews from '../models/mews.model.js'
import User from '../models/user.model.js'

// GET
const list = async (req, res) => {
    try {
        // req queries
        // no "?parent=:parentId" query --> no-parent mews
        let {
            parent = { '$exists': false },
            daysago,
            rank,
		submitter = { '$exists': true }
        } = req.query
        // no "?daysago=Number" query --> all (createdAt exists, which means all)
        let createdAt = daysago
            ? { '$gte': new Date(new Date - daysago * 24 * 60 * 60 * 1000) }
            : { '$exists': true }
        // no "?rank=value" query --> ordered by createdAt desc
        let sort = rank ? { points: -1 } : undefined

        const mewslist = await Mews
            // filter Mews with set conditions
            .find({ parent, createdAt, submitter })
            // sort by points
            .sort(sort)
            // sort by latest added
            .sort({ createdAt: -1 })
            .populate('submitter', '_id username')

        // count total Mews
        const total = await Mews.countDocuments({ parent, createdAt })
        return res.status(200).json({ mews: mewslist, total })
    } catch (error) {
        return res.status(400).json({ message: 'error getting mews list', error })
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
        const { title, link, body, parent } = req.body
        const mews = await new Mews({ submitter, title, link, body, parent })

        // if parent mews is present -
        if (parent) {
            // push to parent's children array
            const parentMews = await Mews.findByIdAndUpdate(parent, { $push: { children: mews } }, { new: true, timestamps: false })
            // mews' ancestor is same as parent's, plus parent's parent
            if (parentMews.parent) {
                // [great-great-grand, great-grand, grand]
                mews.ancestors = parentMews.ancestors
                mews.ancestors.push(parentMews.parent)
            }
        }
        await mews.save()

        // increase karma point
        await User.findByIdAndUpdate(submitter, { $inc: { karma: 1 } }, { timestamps: false })

        return res.status(201).json({ message: 'submitted', mews })
    } catch (error) {
        return res.status(400).json({ message: `submit failed`, error })
    }
}

// controller is called on mews.router with :mewsId param
const mewsById = async (req, res, next, id) => {
    try {
        // get id from route param, router.param
        const mews = await Mews.findById(id)
            .populate('submitter', '_id username')
        // can't find
        // returning 404 when comment is empty is WRONG, let client handle it
        // if (!mews) return res.status(404).json({ error: `can't load Mews ${id}` })
        // attach to req
        req.mews = mews
        // proceed further
        next()
    } catch (error) {
        return res.status(400).json({ message: `no mews with id ${id}`, error })
    }
}

// GET :mewsId
const read = async (req, res) => {
    try {
        // :mewsId is attached to req obj by router param method "mewsById"
        const mews = req.mews
        return res.status(200).json({ mews })
    } catch (error) {
        // db error
        return res.status(400).json({ message: 'error getting mews from req obj', error })
    }
}

// PUT :mewsId
const update = async (req, res) => {
    try {
        const { title, link, body } = req.body
        // error if destruct with es6
        const updatedmews = req.mews

        updatedmews.title = title
        updatedmews.link = link
        updatedmews.body = body

        await updatedmews.save()
        return res.status(202).json({ message: 'updated', mews: updatedmews })
    } catch (error) {
        return res.status(400).json({ message: 'update failed', error })
    }
}

// DELETE :mewsId
const destroy = async (req, res) => {
    try {
        const mews = req.mews
        if (mews.parent) {
            // error if pull "comment" and not "comment._id"
            await Mews.findByIdAndUpdate(mews.parent, { $pull: { children: mews._id } }, { timestamps: false })
        }
        await mews.remove()

        // reduce submitter/owner's karma //might be error !!!!!!!!!!
        await User.findByIdAndUpdate(req.mews.submitter, { $inc: { karma: -1 } }, { timestamps: false })
        return res.status(200).json({ message: 'deleted', mews })
    } catch (error) {
        return res.status(400).json({ message: 'delete failed', error })
    }
}

// PUT :mewsId
const boost = async (req, res) => {
    try {
        const mews = req.mews
        // check if user already had boosted
        if (req.mews.boosters.indexOf(req.auth._id) !== -1) return res.status(200).json({ message: 'already boosted tho' })
        // push booster
        await Mews.findByIdAndUpdate(mews._id, { $push: { boosters: req.auth._id } }, { timestamps: false })
        // increase point
        const boostedmews = await Mews.findByIdAndUpdate(mews._id, { $inc: { points: 1 } }, { new: true, timestamps: false })
        // increase submittor's karma
        await User.findByIdAndUpdate(mews.submitter._id, { $inc: { karma: 1 } }, { timestamps: false })

        return res.status(200).json({ message: 'boosted', mews: boostedmews })
    } catch (error) {
        return res.status(400).json({ message: 'boost failed', error })
    }
}

const unboost = async (req, res) => {
    try {
        const mews = req.mews
        // check if user already had boosted
        if (req.mews.boosters.indexOf(req.auth._id) === -1) return res.status(200).json({ message: 'You didn\'t even boosted tho' })

        // pull booster
        await Mews.findByIdAndUpdate(mews._id, { $pull: { boosters: req.auth._id } }, { timestamps: false })
        // decreast point
        const unboostedmews = await Mews.findByIdAndUpdate(mews._id, { $inc: { points: -1 } }, { new: true, timestamps: false })
        // decrease submittor's karma
        await User.findByIdAndUpdate(mews.submitter._id, { $inc: { karma: -1 } }, { timestamps: false })

        return res.status(200).json({ message: 'unboosted', mews: unboostedmews })
    } catch (error) {
        return res.status(400).json({ message: 'unboost failed', error })
    }
}
export default { list, create, mewsById, read, update, destroy, boost, unboost }
