import express from 'express'

// route controllers
import commentController from '../controllers/comment.controller.js'
import authController from '../controllers/auth.controller.js'

// path: /api/v1/
const router = express.Router()

// path: /api/v1/comments
// method: GET, POST
router.route('/')
    .get(commentController.list)
    .post(authController.requiredSignin, commentController.create)

// path: /api/v1/comments/:commentId
router.param('commentId', commentController.commentById)

// path: /api/v1/comments/r4nd0m1dh3r3
// methods: GET, PUT, DELETE
router.route('/:commentId')
    .get(commentController.read)
    .put(authController.requiredSignin, commentController.requiredOwnership, commentController.update)
    .delete(authController.requiredSignin, commentController.requiredOwnership, commentController.destroy)

export default router