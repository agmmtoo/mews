import jwt from 'jsonwebtoken'
import { config } from 'dotenv'
import expressJwt from 'express-jwt'

import User from '../models/user.model.js'

config()
const SECRET = process.env.SECRET

const signin = async (req, res) => {
    try {
        // get 'username' and 'password' from request body
        const { username, password } = req.body
        // get user by provided username
        const user = await User.findOne({ username })
        // is user blank?
        //if (!user) return res.status(404).json({ message: `User not found` })
        // check password match
        if (!user.authenticate(password)) return res.status(400).json({ message: 'No match' })

        // everything is ok
        // generate token
        const token = jwt.sign({ _id: user._id, username: user.username }, SECRET, { algorithm: 'HS256' })
        return res.status(200).json({ token, user })

    } catch (error) {
        return res.status(400).json({ message: 'Sign in error', error })
    }
}

const requiredSignin = expressJwt({
    secret: SECRET,
    algorithms: ['HS256'],
    userProperty: 'auth'
})

// in routes, this controller is right after requiredSignin
// in PUT /users/:userId, after userId is attached
const requiredAuthorization = async (req, res, next) => {
    try {
        // get _id from userProperty
        const idFromToken = req.auth._id
        // get _id from attached user obj by route param
        const idFromRouteParam = req.user._id

        // since objects are compared, use != and not !==
        if (idFromRouteParam != idFromToken) return res.status(401).json({ message: '"Only you can change yourself!"' })

        // ownership verified
        next()
    } catch (error) {
        return res.status(400).json({ message: 'Error occured checking ownership', error })
    }

}

const requiredOwnership = async (req, res, next) => {
	try {
    // requiredSignin --> req.auth._id
    // mewsById --> req.mews
    if (req.auth._id != req.mews.submitter._id) return res.status(401).json({ message: `you don't own this Mews` })
    next()
	} catch (error) {
		return res.status(400).json({message: 'Error occured checking ownership of Mews', error })
	}
}

export default { signin, requiredSignin, requiredAuthorization, requiredOwnership }
