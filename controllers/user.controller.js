import User from '../models/user.model.js'

const list = async (req, res) => {
    try {
        const userlist = await User.find()
        const count = await User.count()
        return res.status(200).json({ userlist, count })
    } catch (error) {
        return res.status(400).json({ message: 'Can\'t get list of users', error })
    }
}

const create = async (req, res) => {
    try {
        // only need 'username' and 'password' fields
        const { username, password } = req.body

        // username exists?
        const user = await User.findOne({ username })
        if (user) return res.status(409).json({ message: 'Username is taken' })

        // ok, no duplicate
        const newuser = await new User({ username, password })
        await newuser.save()
        return res.status(201).json({ message: 'Successfully created', user: newuser })
    } catch (error) {
        return res.status(400).json({ message: 'Can\'t create user', error })
    }
}

const userById = async (req, res, next, userId) => {
    try {
        const user = await User.findById(userId)
        if (!user) return res.status(404).json({ message: `User ${userId} not found` })
        req.user = user
        next()
    } catch (error) {
        return res.status(400).json({ message: `Couldn't retrieve user with id ${userId}`, error })
    }
}

const read = async (req, res) => {
    try {
        const user = req.user
        if (!user) return res.status(404).json({ message: 'No user is attached' })
        return res.status(200).json(user)
    } catch (error) {
        return res.status(400).json({ message: 'No user found', error })
    }
}

const update = async (req, res) => {
    try {
        const { username, password, about } = req.body
        const updateduser = req.user
        updateduser.username = username
        updateduser.password = password
        updateduser.about = about
        await updateduser.save()
        return res.status(202).json({ message: 'Update successful', updateduser })
    } catch (error) {
        return res.status(400).json({ message: 'Can\'t update user', error })
    }
}

const destroy = async (req, res) => {
    try {
        const user = req.user
        await user.remove()
        return res.status(200).json({ message: 'Successfully deleted', user })
    } catch (error) {
        return res.status(400).json({ message: 'Error deleting user', error })
    }
}

// profile route controller
// req.auth is attached by authController.requiredSignin (express-jwt middleware)
const profile = async (req, res) => {
    try {
        const user = await User.findById(req.auth._id)
        if (!user) return res.status(404).json({ message: `User ${req.auth._user} not found` })
        return res.status(200).json(user)
    } catch (error) {
        return res.status(400).json({ message: 'Can\'t retrieve profile', error })
    }
}

export default { list, create, userById, read, update, destroy, profile }