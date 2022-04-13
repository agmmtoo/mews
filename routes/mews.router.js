import express from 'express'

// route controllers
import mewsController from '../controllers/mews.controller.js'
import authController from '../controllers/auth.controller.js'


// path: /api/v1/
const router = express.Router()

// path: /api/v1/mews
// method: GET, POST
router.route('/')
    .get(mewsController.list)
    // submitting mews requires signing in
    .post(authController.requiredSignin, mewsController.create)

// use to load MEWS by :mewsId param
router.param('mewsId', mewsController.mewsById)

// path: /api/v1/mews/r4nd0m1dh3r3
// methods: GET, PUT, DELETE
router.route('/:mewsId')
    .get(mewsController.read)
    // editing mews requires a sign in, authorized owner
    .put(authController.requiredSignin, mewsController.update)
    .delete(mewsController.destroy)

export default router