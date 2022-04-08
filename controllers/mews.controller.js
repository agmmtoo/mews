import Mews from '../models/mews.model.js'

const list = async (req, res) => {
    try {
        const mewslist = await Mews.find().select('_id title link')
        const count = await Mews.count()
        return res.status(200).json({ mewslist, count })
    } catch (error) {
        return res.status(400).json({ error })
    }
}

const create = async (req, res) => {
    try {
        // only 'title' and 'link' fields
        // are requested here
        const { title, link } = req.body
        const newmews = new Mews({ title, link })
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
        const mews = await Mews.findById(id)
        // can't find
        if (!mews) return res.status(404).json({ error: `Unable to load Mews with id ${id}` })
        // attach to req
        req.mews = mews
        // proceed further
        next()
    } catch (error) {
        return res.status(400).json(error)
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
        return res.status(202).json(updatedmews)
    } catch (error) {
        return res.status(400).json({ error: 'idkman' })
    }
}

const destroy = async (req, res) => {
    try {
        const mews = req.mews
        const removedmews = await mews.remove()
        return res.status(200).json(removedmews)
    } catch (error) {
        return res.status(400).json(error)
    }
}

export default { list, create, mewsById, read, update, destroy }