import express from 'express'

import userController from '../controllers/user.controller.js'
import authController from '../controllers/auth.controller.js'

const router = express.Router()

// path: /api/v1/users
// method: GET
// note - POST is in auth router, since it's SIGNUP
// note - "requiredSignin"
router.route('/')
    .get(authController.requiredSignin, userController.list)

router.route('/profile')
    .get(authController.requiredSignin, userController.profile)

// use to load User by :userId param
router.param('userId', userController.userById)

// path: /api/v1/users/:userId
// method: GET, PUT, DELETE
router.route('/:userId')
    .get(userController.read)
    // to edit profile, one need to sign in and authorized (same id)
    .put(authController.requiredSignin, authController.requiredAuthorization, userController.update)
    .delete(userController.destroy)

export default router
