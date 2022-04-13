import express from 'express'

import userController from '../controllers/user.controller.js'
import authController from '../controllers/auth.controller.js'

const router = express.Router()

// path: /api/v1/auth
// method: POST
// note - GET is in user routes
router.route('/signup')
    .post(userController.create)

router.route('/signin')
    .post(authController.signin)

export default router